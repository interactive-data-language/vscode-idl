import { GetExtensionPath } from '@idl/idl/files';
import {
  type AvailableModel,
  type ChatMessage,
  type ChatMessageRequest,
  type ChatPromptType,
  type ChatStreamChunk,
  DEFAULT_MODELS,
  type TodoItem,
} from '@idl/types/chat';
import {
  AIMessage,
  AIMessageChunk,
  type BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';
import type { StructuredToolInterface } from '@langchain/core/tools';
import { loadMcpTools } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import { readFileSync } from 'fs';
import { OpenAI } from 'openai';
import { join } from 'path';

import {
  LANGCHAIN_TODO_TOOL_NAMES,
  RegisterLangChainToolsForToDos,
} from '../mcp-tools/register-langchain-tools-for-todos';
import type { IChatServiceConfig } from './chat.interface';
import { MCPClient } from './mcp-client.service';

/**
 * Maximum number of agentic loop iterations to prevent infinite loops
 */
const MAX_ITERATIONS = 30;

/**
 * Interval (in milliseconds) for emitting keepalive chunks during long tool execution
 */
const KEEPALIVE_INTERVAL_MS = 15000;

/**
 * Streaming chat completion service backed by LangChain + an OpenAI-compatible API.
 *
 * Stateless per-request — no disk session persistence. Recommended when using
 * Ollama or any provider where the Copilot SDK has compatibility issues.
 */
export class LangChainChatService {
  private readonly config: IChatServiceConfig;
  private mcpClient: MCPClient;
  private mcpReady = false;
  private mcpTools: StructuredToolInterface[] = [];

  constructor(config: IChatServiceConfig) {
    this.config = config;
    this.mcpClient = new MCPClient({ port: config.serverPort });
    this.initializeMCP();
  }

  /**
   * Disconnect the MCP client.
   */
  async disconnect(): Promise<void> {
    await this.mcpClient.disconnect();
    this.mcpReady = false;
  }

  /**
   * Return the list of models available from the configured provider.
   */
  async listModels(): Promise<AvailableModel[]> {
    if (this.config.provider === 'openai' && this.config.openaiApiKey) {
      const openai = new OpenAI({ apiKey: this.config.openaiApiKey });
      const page = await openai.models.list();
      return page.data
        .filter((m) => m.id.startsWith('gpt-'))
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
      console.log(page);
      return page.data
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((m) => ({ description: '', id: m.id, name: m.id }));
    }

    // copilot provider with LangChain engine — return defaults
    return [...DEFAULT_MODELS];
  }

  /**
   * Stream a chat completion via LangChain with an agentic tool-calling loop.
   *
   * @param request - The chat message request with history and model selection
   * @yields Chat stream chunks (tokens, tool calls, tool results, done signal, or errors)
   */
  async *streamChatCompletion(
    request: ChatMessageRequest,
  ): AsyncIterable<ChatStreamChunk> {
    try {
      await this.waitForMCP();

      const model = this.buildChatModel(request.model);

      // Title generation for the very first turn.
      if (request.conversationHistory.length === 0) {
        const title = await this.generateTitle(request.message, request.model);
        if (title) {
          yield { type: 'title', title };
        }
      }

      const todos: TodoItem[] = request.currentTodos
        ? [...request.currentTodos]
        : [];

      const messages = this.buildMessages(request, todos);
      const allTools = [
        ...this.mcpTools,
        ...RegisterLangChainToolsForToDos(todos),
      ];
      const modelWithTools =
        allTools.length > 0 ? model.bindTools(allTools) : model;

      let iteration = 0;
      const continueLoop = true;

      while (continueLoop && iteration < MAX_ITERATIONS) {
        iteration++;

        console.log('Stream');
        const stream = await modelWithTools.stream(messages);

        let accumulated: AIMessageChunk | null = null;

        for await (const chunk of stream) {
          console.log(chunk);
          accumulated = accumulated ? accumulated.concat(chunk) : chunk;

          if (typeof chunk.content === 'string' && chunk.content) {
            yield { type: 'text_chunk', content: chunk.content };
          }
        }

        if (!accumulated) {
          break;
        }

        const toolCalls = accumulated.tool_calls || [];

        if (toolCalls.length > 0) {
          messages.push(
            new AIMessage({
              content:
                typeof accumulated.content === 'string'
                  ? accumulated.content
                  : '',
              tool_calls: toolCalls.map((tc) => ({
                id: tc.id || `tool_${Date.now()}_${Math.random()}`,
                name: tc.name,
                args: tc.args,
              })),
            }),
          );
        } else {
          messages.push(accumulated);
        }

        if (toolCalls.length === 0) {
          break;
        }

        const aiMsg = messages[messages.length - 1] as AIMessage;
        const resolvedToolCalls = aiMsg.tool_calls || [];
        const toolsByName = new Map(allTools.map((t) => [t.name, t]));

        for (const toolCall of resolvedToolCalls) {
          if (LANGCHAIN_TODO_TOOL_NAMES.has(toolCall.name)) {
            iteration--;
          } else {
            yield {
              type: 'tool_call',
              toolName: toolCall.name,
              toolArgs: toolCall.args as Record<string, unknown>,
            };
          }

          const tool = toolsByName.get(toolCall.name);

          try {
            if (!tool) {
              throw new Error(`Unknown tool: ${toolCall.name}`);
            }

            let result: string | undefined;

            try {
              for await (const chunk of this.invokeToolWithHeartbeat(
                tool,
                toolCall.args,
              )) {
                if (chunk.type === 'keepalive') {
                  yield { type: 'keepalive' };
                } else {
                  result = chunk.value;
                }
              }
            } catch (invokeError) {
              if (this.isSessionExpiredError(invokeError)) {
                await this.reinitializeMCP();

                const freshTool = new Map(
                  this.mcpTools.map((t) => [t.name, t]),
                ).get(toolCall.name);

                if (!freshTool) {
                  throw new Error(
                    `Tool "${toolCall.name}" not found after reconnect`,
                  );
                }

                for await (const chunk of this.invokeToolWithHeartbeat(
                  freshTool,
                  toolCall.args,
                )) {
                  if (chunk.type === 'keepalive') {
                    yield { type: 'keepalive' };
                  } else {
                    result = chunk.value;
                  }
                }
              } else {
                throw invokeError;
              }
            }

            if (result === undefined) {
              throw new Error(
                `Tool "${toolCall.name}" completed without returning a result`,
              );
            }

            messages.push(
              new ToolMessage({
                content: result,
                tool_call_id: toolCall.id || '',
              }),
            );

            if (LANGCHAIN_TODO_TOOL_NAMES.has(toolCall.name)) {
              yield { type: 'todo_update', todos: [...todos] };
            } else {
              yield {
                type: 'tool_result',
                toolName: toolCall.name,
                toolError: false,
                toolOutput: result,
              };
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';

            messages.push(
              new ToolMessage({
                content: `Error executing tool: ${errorMessage}`,
                tool_call_id: toolCall.id || '',
              }),
            );

            yield {
              type: 'tool_result',
              toolName: toolCall.name,
              toolError: true,
              toolOutput: errorMessage,
            };
          }
        }
      }

      if (iteration >= MAX_ITERATIONS) {
        console.warn('[LangChainChatService] Max iterations reached');
        yield {
          type: 'text_chunk',
          content: '\n\n[Maximum reasoning steps reached]',
        };
      }

      yield { type: 'done' };
    } catch (error) {
      console.error('[LangChainChatService] Chat completion error:', error);
      yield {
        type: 'error',
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Build a `ChatOpenAI` instance configured for the active provider.
   */
  private buildChatModel(model: string): ChatOpenAI {
    if (this.config.provider === 'ollama') {
      console.log(`Using ollama`);
      const ollamaBase = this.config.ollamaBaseUrl || 'http://localhost:11434';
      return new ChatOpenAI({
        apiKey: 'ollama',
        configuration: { baseURL: `${ollamaBase}/v1` },
        model,
        streaming: true,
        temperature: 0.7,
        // Highlight-start
        modelKwargs: {
          num_ctx: 128000, // Expands your context window to 128k tokens
        },
        // Highlight-end
      });
    }

    if (this.config.provider === 'openai') {
      return new ChatOpenAI({
        apiKey: this.config.openaiApiKey,
        model,
        streaming: true,
        temperature: 0.7,
      });
    }

    // copilot provider — not well-supported via LangChain; fall back to OpenAI key if present
    console.warn(
      '[LangChainChatService] provider=copilot with engine=langchain is not fully supported. ' +
        'Set CHAT_ENGINE=copilot for the best experience.',
    );
    return new ChatOpenAI({
      apiKey: this.config.openaiApiKey || 'no-key',
      model,
      streaming: true,
      temperature: 0.7,
    });
  }

  /**
   * Build the initial message list from the system instructions, conversation
   * history, to-do reminder, and the current user message.
   */
  private buildMessages(
    request: ChatMessageRequest,
    todos: TodoItem[],
  ): BaseMessage[] {
    const messages: BaseMessage[] = [
      new SystemMessage(this.loadInstructions('todo')),
    ];

    if (request.prompt !== 'none') {
      messages.push(new SystemMessage(this.loadInstructions(request.prompt)));
    }

    messages.push(
      ...this.convertToLangChainMessages(request.conversationHistory),
    );

    if (todos.length > 0) {
      const todoMessage = this.formatTodoListMessage(todos);
      if (todoMessage) {
        messages.push(new SystemMessage(todoMessage));
      }
    }

    messages.push(new HumanMessage(request.message.trim()));

    return messages;
  }

  /**
   * Convert stored `ChatMessage` objects to LangChain message types.
   */
  private convertToLangChainMessages(messages: ChatMessage[]): BaseMessage[] {
    return messages.map((msg) => {
      const content = msg.content
        .map((c) => c.payload)
        .join('\n')
        .trim();
      if (msg.type === 'system') return new SystemMessage(content);
      if (msg.type === 'user') return new HumanMessage(content);
      return new AIMessage(content);
    });
  }

  /**
   * Format the to-do list as a markdown checklist for inclusion in system messages.
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
   */
  private async generateTitle(
    firstMessage: string,
    model?: string,
  ): Promise<string> {
    console.log('Generate title');
    const prompt =
      `Create a concise 4-6 word title for a chat session that starts with this message. ` +
      `Reply with only the title, no quotes, no punctuation at the end:\n\n${firstMessage}`;

    try {
      if (this.config.provider === 'ollama') {
        const ollamaBase =
          this.config.ollamaBaseUrl || 'http://localhost:11434';
        const titleModel = model || 'llama3.2';
        const openai = new OpenAI({
          apiKey: 'ollama',
          baseURL: `${ollamaBase}/v1`,
        });
        const completion = await openai.chat.completions.create({
          messages: [{ content: prompt, role: 'user' }],
          model: titleModel,
          temperature: 0,
        });
        console.log(completion);
        const content = completion.choices[0]?.message?.content;
        return typeof content === 'string' ? content.trim() : '';
      }

      if (this.config.openaiApiKey) {
        const openai = new OpenAI({ apiKey: this.config.openaiApiKey });
        const completion = await openai.chat.completions.create({
          messages: [{ content: prompt, role: 'user' }],
          model: 'gpt-4o-mini',
          temperature: 0,
        });
        const content = completion.choices[0]?.message?.content;
        return typeof content === 'string' ? content.trim() : '';
      }
    } catch (err) {
      console.log(
        '[LangChainChatService] Error while getting title for chat:',
        err,
      );
    }

    return '';
  }

  /**
   * Connect to the MCP server and load tools as LangChain tools.
   */
  private async initializeMCP(): Promise<void> {
    try {
      await this.mcpClient.connect();

      this.mcpTools = await loadMcpTools(
        'idl-mcp',
        this.mcpClient.getClient(),
        { throwOnLoadError: false },
      );

      this.mcpReady = true;
      console.log(
        `[LangChainChatService] MCP ready with ${this.mcpTools.length} tools`,
      );
    } catch (error) {
      console.error('[LangChainChatService] Failed to initialize MCP:', error);
      console.warn('[LangChainChatService] Chat will continue without tools');
      this.mcpReady = false;
    }
  }

  /**
   * Invoke a tool with periodic keepalive heartbeats to prevent HTTP timeout.
   */
  private async *invokeToolWithHeartbeat(
    tool: StructuredToolInterface,
    args: Record<string, unknown>,
  ): AsyncIterable<{ type: 'keepalive' } | { type: 'result'; value: string }> {
    const toolPromise = tool.invoke(args);

    while (true) {
      const outcome = await Promise.race([
        toolPromise.then((value) => ({ tag: 'done' as const, value })),
        new Promise<{ tag: 'timeout' }>((resolve) =>
          setTimeout(() => resolve({ tag: 'timeout' }), KEEPALIVE_INTERVAL_MS),
        ),
      ]);

      if (outcome.tag === 'timeout') {
        yield { type: 'keepalive' };
      } else {
        const raw = outcome.value;
        const value = typeof raw === 'string' ? raw : JSON.stringify(raw);
        yield { type: 'result', value };
        return;
      }
    }
  }

  /**
   * Detect errors caused by an expired or missing MCP session.
   */
  private isSessionExpiredError(error: unknown): boolean {
    const msg = error instanceof Error ? error.message : String(error);
    return (
      msg.includes('404') ||
      msg.includes('Session not found') ||
      msg.includes('not initialized') ||
      msg.includes('Not connected')
    );
  }

  /**
   * Load instruction file content for the given prompt type.
   */
  private loadInstructions(prompt: 'todo' | ChatPromptType): string {
    const base = 'extension/github-copilot/instructions';
    switch (prompt) {
      case 'envi':
        return readFileSync(
          GetExtensionPath(join(base, 'envi.instructions.md')),
          'utf-8',
        );
      case 'idl':
        return readFileSync(
          GetExtensionPath(join(base, 'idl.instructions.md')),
          'utf-8',
        );
      case 'idl-envi':
        return [
          readFileSync(
            GetExtensionPath(join(base, 'idl.instructions.md')),
            'utf-8',
          ),
          readFileSync(
            GetExtensionPath(join(base, 'envi.instructions.md')),
            'utf-8',
          ),
        ].join('\n\n---\n\n');
      case 'todo':
        return readFileSync(
          GetExtensionPath(
            join('extension/standalone-mcp', 'todo.instructions.md'),
          ),
          'utf-8',
        );
      default:
        return '';
    }
  }

  /**
   * Disconnect and reconnect the MCP client, reloading all tools.
   * Called when a tool invocation fails due to session expiry.
   */
  private async reinitializeMCP(): Promise<void> {
    this.mcpReady = false;
    this.mcpTools = [];
    try {
      await this.mcpClient.disconnect();
    } catch {
      // ignore — tearing down anyway
    }
    await this.initializeMCP();
  }

  /**
   * Wait for MCP tools to finish loading before the first request.
   */
  private async waitForMCP(): Promise<void> {
    if (this.mcpReady) return;
    await this.initializeMCP();
  }
}
