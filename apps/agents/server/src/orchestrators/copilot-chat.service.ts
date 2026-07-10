import {
  approveAll,
  CopilotClient,
  type CopilotSession,
  type ResumeSessionConfig,
  type SessionConfig,
  type SessionEvent,
} from '@github/copilot-sdk';
import { GetExtensionPath } from '@idl/idl/files';
import { WEBSOCKET_ENABLED_MCP_TOOLS } from '@idl/mcp/websocket';
import type {
  AvailableModel,
  ChatMessageRequest,
  ChatPromptType,
  ChatStreamChunk,
  TodoItem,
} from '@idl/types/chat';
import { readFileSync } from 'fs';
import { OpenAI } from 'openai';
import { homedir } from 'os';
import { join } from 'path';

import {
  RegisterMCPToolsForToDos,
  TODO_TOOL_NAMES,
} from '../mcp-tools/register-mcp-tools-for-todos';
import type { IChatServiceConfig } from '../services/chat.interface';
import { COPILOT_ALLOWED_TOOLS } from './copilot-chat.interface';

/**
 * Interval (in milliseconds) for emitting keepalive chunks during long tool execution
 */
const KEEPALIVE_INTERVAL_MS = 15000;

/**
 * Client name reported to the Copilot runtime in the User-Agent header.
 */
const DEFAULT_CLIENT_NAME = 'idl-chat-agent';

/**
 * Streaming chat completion service backed by the GitHub Copilot SDK.
 *
 * Sessions persist on disk under `COPILOT_HOME` keyed by the frontend
 * `sessionId`, so multi-turn conversations resume cheaply without replaying
 * history through the agent loop. Tools come from the co-hosted local MCP
 * server plus a small set of internal to-do tools that mutate per-request
 * state.
 */
export class CopilotChatService {
  private readonly client: CopilotClient;
  private clientStarted: Promise<void> | undefined;
  private readonly config: IChatServiceConfig;

  constructor(config: IChatServiceConfig) {
    this.config = config;
    this.client = new CopilotClient({
      // `empty` mode disables all Copilot CLI ambient tools (git, curl, etc.)
      // so only the tools explicitly registered via `availableTools` on each
      // session are exposed to the model. Required for server-based usage.
      // `empty` mode requires an explicit baseDirectory for session persistence.
      baseDirectory: join(homedir(), '.copilot'),
      logLevel: 'error',
      mode: 'empty',
      ...(config.provider === 'copilot' && config.copilotGitHubToken
        ? { gitHubToken: config.copilotGitHubToken }
        : {}),
    });
  }

  /**
   * Stop the underlying Copilot SDK client. Idempotent.
   */
  async disconnect(): Promise<void> {
    if (this.clientStarted === undefined) {
      return;
    }
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
   * Return the list of models available from the configured provider.
   *
   * For the Copilot provider, delegates to the SDK runtime. For the OpenAI
   * BYOK provider, the Copilot runtime is not authenticated so we query the
   * OpenAI models API directly and filter to chat-completion-capable models.
   * `description` is not provided by either source so it defaults to an
   * empty string.
   */
  async listModels(): Promise<AvailableModel[]> {
    if (this.config.provider === 'openai' && this.config.openaiApiKey) {
      const openai = new OpenAI({ apiKey: this.config.openaiApiKey });
      const page = await openai.models.list();
      return page.data
        .filter((m) => m.id.startsWith('gpt-5'))
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((m) => ({ description: '', id: m.id, name: m.id }));
    }

    if (this.config.provider === 'ollama') {
      const ollamaBase = this.config.ollamaBaseUrl || 'http://localhost:11434';
      const openai = new OpenAI({
        apiKey: 'ollama',
        baseURL: `${ollamaBase}/v1`,
      });
      const page = await openai.models.list();
      return page.data
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((m) => ({ description: '', id: m.id, name: m.id }));
    }

    await this.ensureClientStarted();
    const models = await this.client.listModels();
    return models.map((m) => ({
      description: '',
      id: m.id,
      name: m.name,
    }));
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
    /** Active session for this request — disconnected in finally. */
    let session: CopilotSession | undefined;

    /** Active keepalive timer — cleared in finally. */
    let keepaliveTimer: NodeJS.Timeout | undefined;

    try {
      await this.ensureClientStarted();

      // Title generation for the very first turn.
      if (request.conversationHistory.length === 0) {
        const title = await this.generateTitle(request.message, request.model);
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
      const activeToolCalls = new Set<string>();

      const startKeepalive = () => {
        if (keepaliveTimer !== undefined) return;
        keepaliveTimer = setInterval(() => {
          enqueue({ type: 'keepalive' });
        }, KEEPALIVE_INTERVAL_MS);
      };
      const stopKeepalive = () => {
        if (keepaliveTimer !== undefined) {
          clearInterval(keepaliveTimer);
          keepaliveTimer = undefined;
        }
      };

      session.on((event: SessionEvent) => {
        switch (event.type) {
          case 'assistant.message_delta': {
            const delta = event.data.deltaContent;
            if (typeof delta === 'string' && delta.length > 0) {
              enqueue({ type: 'text_chunk', content: delta });
            }
            break;
          }
          case 'session.error': {
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
            activeToolCalls.delete(toolCallId);
            if (activeToolCalls.size === 0) {
              stopKeepalive();
            }

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
            activeToolCalls.add(toolCallId);
            startKeepalive();
            if (!TODO_TOOL_NAMES.has(toolName)) {
              enqueue({
                toolArgs: (event.data.arguments || {}) as Record<
                  string,
                  unknown
                >,
                toolCallId,
                toolName,
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
        if (next.type === 'error') break drain;
      }

      await sendPromise;
      yield { type: 'done' };
    } catch (error) {
      console.error('[CopilotChatService] Chat completion error:', error);
      yield {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'error',
      };
    } finally {
      if (keepaliveTimer !== undefined) {
        clearInterval(keepaliveTimer);
      }
      if (session !== undefined) {
        try {
          await session.disconnect();
        } catch (err) {
          console.error(
            '[CopilotChatService] Error disconnecting session:',
            err,
          );
        }
      }
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
    const port = this.config.serverPort || 3000;

    const sessionConfig: ResumeSessionConfig = {
      // Restrict the agent to MCP-sourced tools plus our custom todo tools —
      // mirrors the prior behavior where only those tools were bound.
      availableTools: ['mcp:*', 'custom:*', ...COPILOT_ALLOWED_TOOLS],
      // then use excludedTools to block write/shell
      clientName: DEFAULT_CLIENT_NAME,
      mcpServers: {
        'idl-mcp': {
          type: 'http',
          url: `http://localhost:${port}/mcp`,
          tools: this.config.websocketMode
            ? [...WEBSOCKET_ENABLED_MCP_TOOLS]
            : ['*'], // "*" = all tools, [] = none, or list specific tools
        },
      },
      model: request.model,
      onPermissionRequest: approveAll,
      streaming: true,
      systemMessage: {
        content: this.formatTodoListMessage(todos),
        mode: 'customize',
        sections: {
          custom_instructions: {
            action: 'append',
            content: this.composeInstructions(request.prompt),
          },
        },
      },
      tools,
      largeOutput: {
        enabled: false,
      },
    };

    if (this.config.provider === 'openai' && this.config.openaiApiKey) {
      sessionConfig.provider = {
        apiKey: this.config.openaiApiKey,
        baseUrl: 'https://api.openai.com/v1',
        type: 'openai',
      };
    } else if (this.config.provider === 'ollama') {
      const ollamaBase = this.config.ollamaBaseUrl || 'http://localhost:11434';
      sessionConfig.provider = {
        baseUrl: `${ollamaBase}/v1`,
        type: 'openai',

        maxPromptTokens: 110000,
        maxOutputTokens: 18000,
      };
    }

    return sessionConfig;
  }

  /**
   * Concatenate the standing to-do instructions with any prompt-specific
   * instruction file(s) selected by the caller.
   */
  private composeInstructions(prompt: 'todo' | ChatPromptType): string {
    const base = 'extension/agents/instructions';
    const todo = readFileSync(
      GetExtensionPath(
        join('extension/standalone-mcp', 'todo.instructions.md'),
      ),
      'utf-8',
    );

    const parts: string[] = [todo];
    switch (prompt) {
      case 'envi':
        parts.push(
          readFileSync(
            GetExtensionPath(join(base, 'envi.instructions.md')),
            'utf-8',
          ),
        );
        break;
      case 'idl':
        parts.push(
          readFileSync(
            GetExtensionPath(join(base, 'idl.instructions.md')),
            'utf-8',
          ),
        );
        break;
      case 'idl-envi':
        parts.push(
          readFileSync(
            GetExtensionPath(join(base, 'idl.instructions.md')),
            'utf-8',
          ),
        );
        parts.push(
          readFileSync(
            GetExtensionPath(join(base, 'envi.instructions.md')),
            'utf-8',
          ),
        );
        break;
      default:
        break;
    }

    return parts.join('\n\n---\n\n');
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
   * Format the to-do list as a markdown checklist for inclusion in the
   * system prompt's runtime "content" field.
   */
  private formatTodoListMessage(todos: TodoItem[]): string {
    if (todos.length === 0) return '';

    const doneCount = todos.filter((t) => t.status === 'done').length;
    const total = todos.length;
    const statusSymbol: Record<TodoItem['status'], string> = {
      done: '[x]',
      'in-progress': '[~]',
      pending: '[ ]',
      skipped: '[-]',
    };

    return [
      `Current tasks (${doneCount}/${total} done):`,
      ...todos.map((todo) => `- ${statusSymbol[todo.status]} ${todo.text}`),
    ].join('\n');
  }

  /**
   * Generate a short session title from the first user message.
   *
   * Uses the OpenAI REST API directly when an `OPENAI_API_KEY` is available
   * (both providers); returns an empty string otherwise so the caller can
   * skip the `title` chunk.
   */
  private async generateTitle(
    firstMessage: string,
    model?: string,
  ): Promise<string> {
    if (this.config.provider === 'ollama') {
      const ollamaBase = this.config.ollamaBaseUrl || 'http://localhost:11434';
      const titleModel = model || 'llama3.2';
      try {
        const openai = new OpenAI({
          apiKey: 'ollama',
          baseURL: `${ollamaBase}/v1`,
        });
        const completion = await openai.chat.completions.create({
          messages: [
            {
              content:
                `Create a concise 4-6 word title for a chat session that starts with this message. ` +
                `Reply with only the title, no quotes, no punctuation at the end:\n\n${firstMessage}`,
              role: 'user',
            },
          ],
          model: titleModel,
          temperature: 0,
        });
        const content = completion.choices[0]?.message?.content;
        return typeof content === 'string' ? content.trim() : '';
      } catch (err) {
        console.log(
          '[CopilotChatService] Error while getting title for chat (ollama):',
          err,
        );
        return '';
      }
    }

    if (!this.config.openaiApiKey) {
      return '';
    }
    try {
      const openai = new OpenAI({ apiKey: this.config.openaiApiKey });
      const completion = await openai.chat.completions.create({
        messages: [
          {
            content:
              `Create a concise 4-6 word title for a chat session that starts with this message. ` +
              `Reply with only the title, no quotes, no punctuation at the end:\n\n${firstMessage}`,
            role: 'user',
          },
        ],
        model: 'gpt-4o-mini',
        temperature: 0,
      });
      const content = completion.choices[0]?.message?.content;
      return typeof content === 'string' ? content.trim() : '';
    } catch (err) {
      console.log(
        '[CopilotChatService] Error while getting title for chat:',
        err,
      );
      return '';
    }
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

    try {
      return await this.client.resumeSession(request.sessionId, baseConfig);
    } catch {
      // Session does not exist yet — create it with the same id.
      const createConfig: SessionConfig = {
        sessionId: request.sessionId,
        ...baseConfig,
      };
      return await this.client.createSession(createConfig);
    }
  }
}
