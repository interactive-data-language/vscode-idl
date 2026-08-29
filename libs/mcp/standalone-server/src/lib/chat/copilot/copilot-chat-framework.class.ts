import {
  approveAll,
  CopilotClient,
  type CopilotSession,
  type ResumeSessionConfig,
  RuntimeConnection,
  type SessionConfig,
  type SessionEvent,
} from '@github/copilot-sdk';
import { USER_AGENTS_FOLDER } from '@idl/idl/files';
import type {
  ChatMessageRequest,
  ChatStreamChunk,
  TodoItem,
} from '@idl/types/chat';
import type { IElectronConfig } from '@idl/types/electron';
import { join } from 'path';

import { GetCopilotExecutable } from '../../helpers/get-copilot-executable';
import { GetToolDisplayName } from '../../helpers/get-tool-display-name';
import {
  RegisterMCPToolsForToDos,
  TODO_TOOL_NAMES,
} from '../../mcp-tools/register-mcp-tools-for-todos';
import { Chat } from '../chat.class';
import {
  COPILOT_ALLOWED_TOOLS,
  COPILOT_SESSION_CACHE_CONFIG,
  type ISessionCacheEntry,
} from './copilot-chat-framework.interface';

/**
 * Client name reported to the Copilot runtime in the User-Agent header.
 */
const DEFAULT_CLIENT_NAME = 'idl-chat-agent';

/**
 * Name of IDL MCP server (prefixes all MCP tool names)
 */
export const IDL_MCP_NAME = 'idl-mcp';

/**
 * Streaming chat completion service backed by the GitHub Copilot SDK.
 *
 * Sessions persist on disk under `COPILOT_HOME` keyed by the frontend
 * `sessionId`, so multi-turn conversations resume cheaply without replaying
 * history through the agent loop. Tools come from the co-hosted local MCP
 * server plus a small set of internal to-do tools that mutate per-request
 * state.
 */
export class CopilotChatFramework {
  private readonly client: CopilotClient;
  private clientStarted: Promise<void> | undefined;
  private readonly config: IElectronConfig;
  private parent: Chat;
  /** Live sessions keyed by frontend `sessionId`, reused across turns instead of being disconnected after every message. */
  private readonly sessionCache = new Map<string, ISessionCacheEntry>();
  private sessionCleanupInterval: ReturnType<typeof setInterval> | undefined;

  constructor(parent: Chat, config: IElectronConfig) {
    this.parent = parent;
    this.config = config;

    this.client = new CopilotClient({
      /**
       * Root folder for things related to chats to live
       */
      baseDirectory: join(USER_AGENTS_FOLDER, '.copilot'),
      logLevel: 'error',
      // `empty` mode disables all Copilot CLI ambient tools (git, curl, etc.)
      // so only the tools explicitly registered via `availableTools` on each
      // session are exposed to the model. Required for server-based usage.
      // `empty` mode requires an explicit baseDirectory for session persistence.
      mode: 'empty',

      /**
       * Manually spawn the copilot exe through stdio
       *
       * This is because we have issues running natively through electron and
       * can't use in-process like we can in dev mode or standalone electron
       *
       * We also have webpack configured to exclude the copilot and koffi binary
       * libraries for us
       */
      connection: RuntimeConnection.forStdio({
        path: GetCopilotExecutable(),
        args: [],
      }),

      ...(this.config.agent.llm.model === 'copilot'
        ? { gitHubToken: this.config.agent.llm.config.gitHubToken }
        : {}),
    });

    // start the client
    this.clientStarted = this.client.start();

    // start evicting sessions that have been idle too long
    this.cleanupUnusedSessions();
  }

  /**
   * Interrupts the in-flight turn for a cached session, if any, without
   * disconnecting the session — a follow-up message can still resume it.
   */
  async cancelSession(sessionId: string): Promise<void> {
    const entry = this.sessionCache.get(sessionId);
    if (entry === undefined) {
      return;
    }
    try {
      await entry.session.rpc.interruptMainTurn({});
    } catch (err) {
      console.error('[CopilotChatService] Error interrupting turn:', err);
    }
  }

  /**
   * Stop the underlying Copilot SDK client. Idempotent.
   */
  async disconnect(): Promise<void> {
    if (this.clientStarted === undefined) {
      return;
    }
    if (this.sessionCleanupInterval !== undefined) {
      clearInterval(this.sessionCleanupInterval);
      this.sessionCleanupInterval = undefined;
    }
    await Promise.allSettled(
      Array.from(this.sessionCache.keys()).map((sessionId) =>
        this.disconnectSession(sessionId),
      ),
    );
    try {
      await this.clientStarted;
      await this.client.stop();
    } catch (err) {
      console.error('[CopilotChatService] Error during shutdown:', err);
    } finally {
      this.clientStarted = undefined;
    }
  }

  /**
   * Stream a chat completion using the Copilot SDK.
   *
   * Subscribes to the session event stream and translates SDK events into the
   * existing `ChatStreamChunk` SSE wire contract used by the frontend.
   *
   * @param request - The chat message request with history and model selection
   * @yields Chat stream chunks (tokens, tool calls, tool results, done signal, or errors)
   */
  async *streamChatCompletion(
    request: ChatMessageRequest,
  ): AsyncIterable<ChatStreamChunk> {
    /** Active session for this request, reused across turns via the cache. */
    let session: CopilotSession | undefined;
    /** Unsubscribes the event handler registered below, called in finally. */
    let unsubscribe: (() => void) | undefined;

    try {
      await this.ensureClientStarted();

      // Title generation for the very first turn.
      if (request.conversationHistory.length === 0) {
        const title = await this.parent.generateTitle(
          request.message,
          request.model,
        );
        if (title) {
          yield { type: 'title', title };
        }
      }

      // Per-request to-do list, mutated in place by the todo tools.
      const todos: TodoItem[] = request.currentTodos
        ? [...request.currentTodos]
        : [];

      session = await this.getOrCreateSession(request, todos);

      /** Buffered event queue feeding the async iterator. */
      const queue: (ChatStreamChunk | null)[] = [];
      let resolveNext: (() => void) | undefined;

      const enqueue = (chunk: ChatStreamChunk | null) => {
        queue.push(chunk);
        if (resolveNext !== undefined) {
          const fn = resolveNext;
          resolveNext = undefined;
          fn();
        }
      };

      /** Map of in-flight tool call id -> tool name (start-event names are authoritative). */
      const toolNameById = new Map<string, string>();

      unsubscribe = session.on((event: SessionEvent) => {
        if (event.type === 'assistant.intent') {
          console.log(`Intent: ${event.data.intent}`);
        }
        switch (event.type) {
          case 'abort': {
            // User-requested interruption via interruptMainTurn(); keep the
            // session alive, just end this turn's stream.
            enqueue({ type: 'cancelled' });
            enqueue(null);
            break;
          }
          case 'assistant.message_delta': {
            const delta = event.data.deltaContent;
            if (typeof delta === 'string' && delta.length > 0) {
              enqueue({ type: 'text_chunk', content: delta });
            }
            break;
          }
          case 'assistant.reasoning': {
            // full content is redundant with the accumulated deltas, so this only signals completion
            enqueue({
              content: '',
              done: true,
              thinkingId: event.data.reasoningId,
              type: 'thinking_chunk',
            });
            break;
          }
          case 'assistant.reasoning_delta': {
            enqueue({
              content: event.data.deltaContent,
              done: false,
              thinkingId: event.data.reasoningId,
              type: 'thinking_chunk',
            });
            break;
          }
          case 'session.error': {
            // don't reuse a session that reported an error
            this.disconnectSession(request.sessionId);
            enqueue({ type: 'error', error: event.data.message });
            enqueue(null);
            break;
          }
          case 'session.idle': {
            enqueue(null);
            break;
          }
          case 'tool.execution_complete': {
            const { toolCallId, success } = event.data;
            const toolName =
              toolNameById.get(toolCallId) ||
              event.data.toolDescription?.name ||
              '';
            toolNameById.delete(toolCallId);

            if (TODO_TOOL_NAMES.has(toolName)) {
              // todo tools mutate the shared list directly inside their handler
              enqueue({ type: 'todo_update', todos: [...todos] });
            } else if (success) {
              enqueue({
                toolCallId,
                toolError: false,
                toolName,
                toolOutput: event.data.result?.content || '',
                type: 'tool_result',
              });
            } else {
              enqueue({
                toolCallId,
                toolError: true,
                toolName,
                toolOutput:
                  event.data.error?.message || 'Tool execution failed',
                type: 'tool_result',
              });
            }
            break;
          }
          case 'tool.execution_start': {
            const { toolCallId, toolName } = event.data;
            toolNameById.set(toolCallId, toolName);
            // send to the front-end when it is not a ToDo tool
            if (!TODO_TOOL_NAMES.has(toolName)) {
              enqueue({
                toolArgs: (event.data.arguments || {}) as Record<
                  string,
                  unknown
                >,
                toolCallId,
                toolName: GetToolDisplayName(
                  toolName.replace(`${IDL_MCP_NAME}-`, ''),
                ),
                type: 'tool_call',
              });
            }
            break;
          }
          default:
            break;
        }
      });

      // Fire the message but do not await — the event stream drives the iterator.
      const sendPromise = session
        .send({ prompt: request.message })
        .catch((err: unknown) => {
          enqueue({
            error:
              err instanceof Error ? err.message : 'Failed to send message',
            type: 'error',
          });
          enqueue(null);
        });

      // Drain the queue until a terminator (null) is encountered.
      let terminatedEarly = false;
      drain: while (true) {
        if (queue.length === 0) {
          await new Promise<void>((resolve) => {
            resolveNext = resolve;
          });
        }
        const next = queue.shift();
        if (next === undefined) continue;
        if (next === null) break drain;
        yield next;
        if (next.type === 'error' || next.type === 'cancelled') {
          terminatedEarly = true;
          break drain;
        }
      }

      await sendPromise;
      if (!terminatedEarly) {
        yield { type: 'done' };
      }
    } catch (error) {
      console.error('[CopilotChatService] Chat completion error:', error);
      yield {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'error',
      };
    } finally {
      unsubscribe?.();
    }
  }

  /**
   * Build the shared session configuration used for both resume and create.
   * Excludes the create-only `sessionId` field.
   */
  private buildSessionConfig(
    request: ChatMessageRequest,
    todos: TodoItem[],
  ): ResumeSessionConfig {
    const tools = RegisterMCPToolsForToDos(todos);
    const port = this.config.server.port || 3000;

    const sessionConfig: ResumeSessionConfig = {
      // Restrict the agent to MCP-sourced tools plus our custom todo tools —
      // mirrors the prior behavior where only those tools were bound.
      availableTools: ['mcp:*', 'custom:*', ...COPILOT_ALLOWED_TOOLS],
      // then use excludedTools to block write/shell
      clientName: DEFAULT_CLIENT_NAME,
      mcpServers: {
        /**
         * If you change this, we need to change the values above for IDL_MCP_NAME
         */
        'idl-mcp': {
          type: 'http',
          url: `http://localhost:${port}/mcp`,
          tools: this.parent.getAllowedTools(),
          // 60-minute timeout to accommodate long-running IDL/ENVI tools
          timeout: 60 * 60 * 1000,
        },
      },
      model: request.model,
      onPermissionRequest: approveAll,
      // Chat Completions never carries reasoning data; only the Responses API does
      reasoningSummary: 'detailed',
      reasoningEffort: 'medium',

      streaming: true,
      systemMessage: {
        content: this.parent.formatToDoList(todos),
        mode: 'customize',
        sections: {
          custom_instructions: {
            action: 'append',
            content: this.parent.loadManyInstructions([
              'todo',
              request.instructions,
            ]),
          },
        },
      },
      tools,
      largeOutput: {
        enabled: false,
      },
    };

    // set the model for the session
    this.setModelProvider(sessionConfig);

    return sessionConfig;
  }

  /**
   * Periodically checks for idle sessions and disconnects/evicts them
   */
  private cleanupUnusedSessions() {
    this.sessionCleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [sessionId, entry] of this.sessionCache.entries()) {
        const idle = now - entry.lastActivity;
        if (idle >= COPILOT_SESSION_CACHE_CONFIG.SESSION_IDLE_TIMEOUT) {
          this.disconnectSession(sessionId);
        }
      }
    }, COPILOT_SESSION_CACHE_CONFIG.SESSION_CLEANUP_INTERVAL);
  }

  /**
   * Disconnects and removes a cached session, if present. Safe to call
   * repeatedly or for a session that isn't cached.
   */
  private async disconnectSession(sessionId: string): Promise<void> {
    const entry = this.sessionCache.get(sessionId);
    if (entry === undefined) {
      return;
    }
    this.sessionCache.delete(sessionId);
    try {
      await entry.session.disconnect();
    } catch (err) {
      console.error(
        `[CopilotChatService] Error disconnecting session "${sessionId}":`,
        err,
      );
    }
  }

  /**
   * Lazily start the Copilot SDK client on first use and cache the start
   * promise so subsequent calls reuse the same connection.
   */
  private async ensureClientStarted(): Promise<void> {
    if (this.clientStarted === undefined) {
      this.clientStarted = this.client.start();
    }
    await this.clientStarted;
  }

  /**
   * Resume the session by id, falling back to creating a new one when it
   * doesn't exist on disk yet.
   */
  private async getOrCreateSession(
    request: ChatMessageRequest,
    todos: TodoItem[],
  ): Promise<CopilotSession> {
    const baseConfig = this.buildSessionConfig(request, todos);

    let session: CopilotSession;
    try {
      session = await this.client.resumeSession(request.sessionId, baseConfig);
    } catch {
      // Session does not exist yet — create it with the same id.
      const createConfig: SessionConfig = {
        sessionId: request.sessionId,
        ...baseConfig,
      };
      session = await this.client.createSession(createConfig);
    }

    // save to recent cache
    this.sessionCache.set(request.sessionId, {
      session,
      lastActivity: Date.now(),
    });

    return session;
  }

  /**
   * Set the model provider configuration
   */
  private setModelProvider(sessionConfig: ResumeSessionConfig) {
    switch (this.config.agent.llm.model) {
      case 'copilot':
        // do nothing, should be set when creating session
        break;
      case 'ollama':
        sessionConfig.provider = {
          baseUrl: `${this.config.agent.llm.config.url}/v1`,
          type: 'openai',
          maxPromptTokens: this.config.agent.llm.config.maxPromptTokens,
          maxOutputTokens: this.config.agent.llm.config.maxOutputTokens,
        };
        break;
      case 'openai':
        sessionConfig.provider = {
          apiKey: this.config.agent.llm.config.apiKey,
          baseUrl: 'https://api.openai.com/v1',
          type: 'openai',
          // reasoning summaries are only exposed over the Responses API
          wireApi: 'responses',
        };
        break;
      default:
        break;
    }
  }
}
