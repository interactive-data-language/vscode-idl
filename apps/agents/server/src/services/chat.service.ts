import { GetExtensionPath } from '@idl/idl/files';
import type {
  ChatMessage,
  ChatMessageRequest,
  ChatPromptType,
  ChatStreamChunk,
} from '@idl/types/chat';
import {
  AIMessage,
  AIMessageChunk,
  type BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';
import type { DynamicStructuredTool } from '@langchain/core/tools';
import { loadMcpTools } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import { readFileSync } from 'fs';
import { join } from 'path';

import { MCPClient } from './mcp-client.service';

/**
 * Maximum number of agentic loop iterations to prevent infinite loops
 */
const MAX_ITERATIONS = 20;

/**
 * Service for handling chat completions using LangChain and OpenAI
 */
export class ChatService {
  private mcpClient: MCPClient;
  private mcpReady = false;
  private mcpTools: DynamicStructuredTool[] = [];
  private openaiApiKey: string;

  constructor(openaiApiKey: string, mcpPort?: number) {
    this.openaiApiKey = openaiApiKey;
    this.mcpClient = new MCPClient({ port: mcpPort });
    this.initializeMCP();
  }

  /**
   * Disconnect the MCP client
   */
  async disconnect(): Promise<void> {
    await this.mcpClient.disconnect();
    this.mcpReady = false;
  }

  /**
   * Stream a chat completion from OpenAI with agentic tool calling
   *
   * @param request - The chat message request with history and model selection
   * @yields Chat stream chunks (tokens, tool calls, tool results, done signal, or errors)
   */
  async *streamChatCompletion(
    request: ChatMessageRequest,
  ): AsyncIterable<ChatStreamChunk> {
    try {
      // Wait for MCP to be ready
      await this.waitForMCP();

      // Initialize ChatOpenAI with streaming enabled
      const model = new ChatOpenAI({
        apiKey: this.openaiApiKey,
        model: request.model,
        streaming: true,
        temperature: 0.7,
      });

      // Bind MCP tools to the model if available
      const modelWithTools =
        this.mcpTools.length > 0 ? model.bindTools(this.mcpTools) : model;

      // Convert conversation history to LangChain format
      const messages: BaseMessage[] = this.convertToLangChainMessages(
        request.conversationHistory,
      );

      // Prepend system instructions if a prompt type is specified
      if (request.prompt !== 'none') {
        messages.unshift(
          new SystemMessage(this.loadInstructions(request.prompt)),
        );
      }

      // Add the new user message
      messages.push(
        new HumanMessage(this.extractMessageContent(request.message)),
      );

      // Agentic loop: keep calling the model until it stops using tools
      let iteration = 0;
      let continueLoop = true;

      while (continueLoop && iteration < MAX_ITERATIONS) {
        iteration++;

        // Stream the completion
        const stream = await modelWithTools.stream(messages);

        // Accumulate chunks using LangChain's built-in concat
        let accumulated: AIMessageChunk | null = null;

        for await (const chunk of stream) {
          accumulated = accumulated ? accumulated.concat(chunk) : chunk;

          // Handle text content - yield chunks as they arrive
          if (typeof chunk.content === 'string' && chunk.content) {
            yield {
              type: 'text_chunk',
              content: chunk.content,
            };
          }
        }

        // If we got no response, exit
        if (!accumulated) {
          continueLoop = false;
          break;
        }

        // Check for tool calls from the accumulated message
        const toolCalls = accumulated.tool_calls ?? [];

        // Convert AIMessageChunk to a proper AIMessage before adding to history.
        // AIMessageChunk may not serialize tool_calls correctly for the API on
        // subsequent iterations, causing the model to miss tool call context.
        if (toolCalls.length > 0) {
          messages.push(
            new AIMessage({
              content:
                typeof accumulated.content === 'string'
                  ? accumulated.content
                  : '',
              tool_calls: toolCalls.map((tc) => ({
                id: tc.id ?? `tool_${Date.now()}_${Math.random()}`,
                name: tc.name,
                args: tc.args,
              })),
            }),
          );
        } else {
          messages.push(accumulated);
        }

        // If no tool calls, we're done
        if (toolCalls.length === 0) {
          continueLoop = false;
          break;
        }

        // Use the tool call IDs from the message we just pushed
        const aiMsg = messages[messages.length - 1] as AIMessage;
        const resolvedToolCalls = aiMsg.tool_calls ?? [];

        // Execute tool calls using the LangChain tools from loadMcpTools
        const toolsByName = new Map(this.mcpTools.map((t) => [t.name, t]));

        for (const toolCall of resolvedToolCalls) {
          // Notify user that we're calling a tool
          yield {
            type: 'tool_call',
            toolName: toolCall.name,
            toolArgs: toolCall.args as Record<string, unknown>,
          };

          const tool = toolsByName.get(toolCall.name);
          try {
            if (!tool) {
              throw new Error(`Unknown tool: ${toolCall.name}`);
            }

            /** init tool result */
            let result: string;

            // try to run
            try {
              result = await tool.invoke(toolCall.args);
            } catch (invokeError) {
              // if we fail, see if it is because of a connection error
              if (this.isSessionExpiredError(invokeError)) {
                // reconnect
                await this.reinitializeMCP();

                // fetch tool again
                const freshTool = new Map(
                  this.mcpTools.map((t) => [t.name, t]),
                ).get(toolCall.name);

                // verify tool still exists
                if (!freshTool) {
                  throw new Error(
                    `Tool "${toolCall.name}" not found after reconnect`,
                  );
                }

                // run with new connection
                result = await freshTool.invoke(toolCall.args);
              } else {
                throw invokeError;
              }
            }

            // Build a ToolMessage from the result
            const resultContent =
              typeof result === 'string' ? result : JSON.stringify(result);

            messages.push(
              new ToolMessage({
                content: resultContent,
                tool_call_id: toolCall.id ?? '',
              }),
            );

            // Notify user of tool result
            yield {
              type: 'tool_result',
              toolName: toolCall.name,
              toolError: false,
              toolOutput: resultContent,
            };
          } catch (error) {
            // Handle tool execution errors
            let errorMessage =
              error instanceof Error ? error.message : 'Unknown error';

            // Augment schema validation errors with a human-readable field diff
            if (errorMessage.includes('did not match expected schema')) {
              const jsonSchema = tool?.schema as {
                properties?: Record<string, unknown>;
                required?: string[];
              };
              const required = jsonSchema?.required ?? [];
              const received = Object.keys(toolCall.args as object);
              const missing = required.filter(
                (k) => !(k in (toolCall.args as object)),
              );
              const unexpected = received.filter(
                (k) => !jsonSchema?.properties?.[k],
              );
              const lines: string[] = [
                `Schema mismatch for tool '${toolCall.name}':`,
              ];
              if (missing.length > 0)
                lines.push(`  Missing required: [${missing.join(', ')}]`);
              if (unexpected.length > 0)
                lines.push(`  Unexpected fields: [${unexpected.join(', ')}]`);
              lines.push(`  Received fields: [${received.join(', ')}]`);
              errorMessage = `${lines.join('\n')}\n${errorMessage}`;
            }

            // Add error as tool result so the model can handle it
            messages.push(
              new ToolMessage({
                content: `Error executing tool: ${errorMessage}`,
                tool_call_id: toolCall.id ?? '',
              }),
            );

            // Notify user of error
            yield {
              type: 'tool_result',
              toolName: toolCall.name,
              toolError: true,
              toolOutput: errorMessage,
            };
          }
        }
      }

      // Check if we hit max iterations
      if (iteration >= MAX_ITERATIONS) {
        console.warn('[ChatService] Max iterations reached in agentic loop');
        yield {
          type: 'text_chunk',
          content: '\n\n[Maximum reasoning steps reached]',
        };
      }

      // Signal completion
      yield { type: 'done' };
    } catch (error) {
      // Handle errors gracefully
      console.error('Chat completion error:', error);
      yield {
        type: 'error',
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Convert chat messages to LangChain message format
   */
  private convertToLangChainMessages(messages: ChatMessage[]): BaseMessage[] {
    return messages.map((msg) => {
      const content = this.extractMessageContent(
        msg.content.map((c) => c.payload).join('\n'),
      );

      if (msg.type === 'system') {
        return new SystemMessage(content);
      } else if (msg.type === 'user') {
        return new HumanMessage(content);
      } else {
        return new AIMessage(content);
      }
    });
  }

  /**
   * Extract plain text content from message
   */
  private extractMessageContent(content: string): string {
    return content.trim();
  }

  /**
   * Generate a short session title from the first user message
   */
  private async generateTitle(firstMessage: string): Promise<null | string> {
    try {
      const model = new ChatOpenAI({
        apiKey: this.openaiApiKey,
        model: 'gpt-4o-mini',
        streaming: false,
        temperature: 0,
      });
      const response = await model.invoke([
        new HumanMessage(
          `Create a concise 4-6 word title for a chat session that starts with this message. ` +
            `Reply with only the title, no quotes, no punctuation at the end:\n\n${firstMessage}`,
        ),
      ]);
      const text =
        typeof response.content === 'string' ? response.content.trim() : null;
      return text || null;
    } catch {
      return null;
    }
  }

  /**
   * Initialize our MCP connection
   */
  private async initializeMCP(): Promise<void> {
    try {
      await this.mcpClient.connect();

      // Load MCP tools as LangChain tools
      this.mcpTools = await loadMcpTools(
        'idl-mcp',
        this.mcpClient.getClient(),
        {
          throwOnLoadError: false,
        },
      );

      // Enable detailed schema validation errors on each tool so failures
      // report which fields are missing/invalid instead of a generic message
      for (const tool of this.mcpTools) {
        tool.verboseParsingErrors = true;
      }

      this.mcpReady = true;
      console.log(
        `[ChatService] MCP client ready with ${this.mcpTools.length} tools`,
      );
    } catch (error) {
      console.error('[ChatService] Failed to initialize MCP client:', error);
      console.warn('[ChatService] Chat will continue without tools');
      this.mcpReady = false;
    }
  }

  /**
   * Detect errors caused by an expired or missing MCP session
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
   * For 'idl-envi', both files are concatenated with a separator.
   */
  private loadInstructions(prompt: ChatPromptType): string {
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
      // ignore — we're tearing down anyway
    }
    await this.initializeMCP();
  }

  /**
   * Wait for MCP to be ready (with timeout)
   */
  private async waitForMCP(timeoutMs = 5000): Promise<boolean> {
    const startTime = Date.now();
    while (!this.mcpReady && Date.now() - startTime < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return this.mcpReady;
  }
}
