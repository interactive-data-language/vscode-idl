import type {
  ChatMessage,
  ChatMessageRequest,
  ChatStreamChunk,
} from '@idl/types/chat';
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';

/**
 * Service for handling chat completions using LangChain and OpenAI
 */
export class ChatService {
  private openaiApiKey: string;

  constructor(openaiApiKey: string) {
    this.openaiApiKey = openaiApiKey;
  }

  /**
   * Stream a chat completion from OpenAI
   *
   * @param request - The chat message request with history and model selection
   * @yields Chat stream chunks (tokens, done signal, or errors)
   */
  async *streamChatCompletion(
    request: ChatMessageRequest,
  ): AsyncIterable<ChatStreamChunk> {
    try {
      // Initialize ChatOpenAI with streaming enabled
      const model = new ChatOpenAI({
        apiKey: this.openaiApiKey,
        modelName: request.model,
        streaming: true,
        temperature: 0.7,
      });

      // Convert conversation history to LangChain format
      const messages = this.convertToLangChainMessages(
        request.conversationHistory,
      );

      // Add the new user message
      messages.push(
        new HumanMessage(this.extractMessageContent(request.message)),
      );

      // Stream the completion
      const stream = await model.stream(messages);

      for await (const chunk of stream) {
        // Each chunk contains a piece of the response
        const content = chunk.content;
        if (typeof content === 'string' && content) {
          yield {
            type: 'token',
            content,
          };
        }
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
  private convertToLangChainMessages(
    messages: ChatMessage[],
  ): Array<AIMessage | HumanMessage | SystemMessage> {
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
   * Extract plain text content from message
   */
  private extractMessageContent(content: string): string {
    return content.trim();
  }
}
