import type {
  ChatMessage,
  ChatMessageRequest,
  ChatStreamChunk,
} from '@idl/types/chat';
import {
  AIMessage,
  type BaseMessage,
  HumanMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';

import { convertMCPToolsToOpenAI } from '../utils/convert-mcp-tools';
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
        modelName: request.model,
        streaming: true,
        temperature: 0.7,
      });

      // Convert conversation history to LangChain format
      const messages: BaseMessage[] = this.convertToLangChainMessages(
        request.conversationHistory,
      );

      // Add the new user message
      messages.push(
        new HumanMessage(this.extractMessageContent(request.message)),
      );

      // Get tools from MCP if available
      const tools = this.mcpReady
        ? convertMCPToolsToOpenAI(this.mcpClient.getTools())
        : [];

      // Agentic loop: keep calling the model until it stops using tools
      let iteration = 0;
      let continueLoop = true;

      while (continueLoop && iteration < MAX_ITERATIONS) {
        iteration++;

        // Stream options with tools
        const streamOptions =
          tools.length > 0
            ? {
                tools,
                tool_choice: 'auto' as const,
                parallel_tool_calls: true,
              }
            : {};

        // Stream the completion
        const stream = await model.stream(messages, streamOptions);

        // Accumulate the assistant's response and tool calls
        let assistantMessage = '';
        const toolCalls: Array<{
          id: string;
          name: string;
          args: Record<string, unknown>;
        }> = [];

        for await (const chunk of stream) {
          // Handle text content
          if (typeof chunk.content === 'string' && chunk.content) {
            assistantMessage += chunk.content;
            yield {
              type: 'token',
              content: chunk.content,
            };
          }

          // Handle tool calls
          if (chunk.tool_calls && chunk.tool_calls.length > 0) {
            for (const toolCall of chunk.tool_calls) {
              // Check if this is a new tool call or an update
              const existingIndex = toolCalls.findIndex(
                (tc) => tc.id === toolCall.id,
              );

              if (existingIndex === -1) {
                // New tool call
                toolCalls.push({
                  id: toolCall.id || `tool_${Date.now()}`,
                  name: toolCall.name || '',
                  args: (toolCall.args as Record<string, unknown>) || {},
                });
              } else {
                // Update existing tool call (streaming chunks)
                if (toolCall.name) {
                  toolCalls[existingIndex].name = toolCall.name;
                }
                if (toolCall.args) {
                  toolCalls[existingIndex].args = {
                    ...toolCalls[existingIndex].args,
                    ...(toolCall.args as Record<string, unknown>),
                  };
                }
              }
            }
          }
        }

        // Add assistant message to conversation history
        if (assistantMessage || toolCalls.length > 0) {
          const aiMessage = new AIMessage({
            content: assistantMessage,
            tool_calls:
              toolCalls.length > 0
                ? toolCalls.map((tc) => ({
                    id: tc.id,
                    name: tc.name,
                    args: tc.args,
                  }))
                : undefined,
          });
          messages.push(aiMessage);
        }

        // If no tool calls, we're done
        if (toolCalls.length === 0) {
          continueLoop = false;
          break;
        }

        // Execute tool calls and add results to conversation
        if (this.mcpReady) {
          for (const toolCall of toolCalls) {
            // Notify user that we're calling a tool
            yield {
              type: 'tool_call',
              content: `Calling tool: ${toolCall.name}`,
              toolName: toolCall.name,
            };

            try {
              const toolMessage = await this.executeToolCall(toolCall);
              messages.push(toolMessage);

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
                  tool_call_id: toolCall.id,
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
        } else {
          // MCP not ready, can't execute tools - exit loop
          continueLoop = false;
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
        return new AIMessage(content);
      } else if (msg.role === 'user') {
        return new HumanMessage(content);
      } else {
        // Fallback
        return new HumanMessage(content);
      }
    });
  }

  /**
   * Execute a tool call via MCP and return the result as a ToolMessage
   *
   * @param toolCall - Tool call information (id, name, args)
   * @returns ToolMessage containing the tool execution result
   * @throws Error if tool execution fails
   */
  private async executeToolCall(toolCall: {
    id: string;
    name: string;
    args: Record<string, unknown>;
  }): Promise<ToolMessage> {
    console.log('Calling tool');
    console.log(toolCall.name);
    console.log(toolCall.args);

    // Call the tool via MCP
    const result = await this.mcpClient.callTool(toolCall.name, toolCall.args);

    // Extract text content from MCP response
    const resultText = result.content
      .map((c) => {
        if (c.type === 'text') {
          return c.text;
        }
        return JSON.stringify(c);
      })
      .join('\n');

    // Return tool result as ToolMessage
    return new ToolMessage({
      content: resultText,
      tool_call_id: toolCall.id,
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
      this.mcpReady = true;
      console.log('[ChatService] MCP client ready');
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
