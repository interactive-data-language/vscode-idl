import type {
  ChatMessage,
  ChatMessageRequest,
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

import { MCPClient } from './mcp-client.service';

/**
 * Maximum number of agentic loop iterations to prevent infinite loops
 */
const MAX_ITERATIONS = 10;

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

          // Handle text content - yield tokens as they arrive
          if (typeof chunk.content === 'string' && chunk.content) {
            yield {
              type: 'token',
              content: chunk.content,
            };
          }
        }

        // If we got no response, exit
        if (!accumulated) {
          continueLoop = false;
          break;
        }

        // Add the accumulated message to conversation history
        messages.push(accumulated);

        // Check for tool calls from the accumulated message
        const toolCalls = accumulated.tool_calls ?? [];

        // If no tool calls, we're done
        if (toolCalls.length === 0) {
          continueLoop = false;
          break;
        }

        // Execute tool calls using the LangChain tools from loadMcpTools
        const toolsByName = new Map(this.mcpTools.map((t) => [t.name, t]));

        for (const toolCall of toolCalls) {
          // Notify user that we're calling a tool
          yield {
            type: 'tool_call',
            content: `Calling tool: ${toolCall.name}`,
            toolName: toolCall.name,
          };

          try {
            const tool = toolsByName.get(toolCall.name);
            if (!tool) {
              throw new Error(`Unknown tool: ${toolCall.name}`);
            }

            // Invoke the LangChain tool (handles MCP call internally)
            const result = await tool.invoke(toolCall.args);

            // Build a ToolMessage from the result
            const resultContent =
              typeof result === 'string' ? result : JSON.stringify(result);

            messages.push(
              new ToolMessage({
                content: resultContent,
                tool_call_id: toolCall.id ?? `tool_${Date.now()}`,
              }),
            );

            // Notify user of tool result
            yield {
              type: 'tool_result',
              content: `Tool ${toolCall.name} completed`,
              toolName: toolCall.name,
            };
          } catch (error) {
            // Handle tool execution errors
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';

            console.error(
              `[ChatService] Tool execution failed for ${toolCall.name}:`,
              error,
            );

            // Add error as tool result so the model can handle it
            messages.push(
              new ToolMessage({
                content: `Error executing tool: ${errorMessage}`,
                tool_call_id: toolCall.id ?? `tool_${Date.now()}`,
              }),
            );

            // Notify user of error
            yield {
              type: 'tool_result',
              content: `Tool ${toolCall.name} failed: ${errorMessage}`,
              toolName: toolCall.name,
            };
          }
        }
      }

      // Check if we hit max iterations
      if (iteration >= MAX_ITERATIONS) {
        console.warn('[ChatService] Max iterations reached in agentic loop');
        yield {
          type: 'token',
          content: '\n\n[Maximum reasoning steps reached]',
        };
      }

      // Signal completion
      yield {
        type: 'done',
        content: '',
      };
    } catch (error) {
      // Handle errors gracefully
      console.error('Chat completion error:', error);
      yield {
        type: 'error',
        content: '',
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

      if (msg.role === 'system') {
        return new SystemMessage(content);
      } else if (msg.role === 'user') {
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
   * Initialize MCP client connection
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
