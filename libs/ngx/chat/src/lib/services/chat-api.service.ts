import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type {
  AvailableModelsResponse,
  ChatMessageRequest,
  ChatStreamChunk,
} from '@idl/types/chat';
import { Observable } from 'rxjs';

/**
 * Service for communicating with the chat API
 */
@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  /** Base URL for REST API */
  private readonly baseUrl = '/api/chat';

  /** HTTP client */
  private readonly http = inject(HttpClient);

  /**
   * Get list of available models
   */
  getAvailableModels(): Observable<AvailableModelsResponse> {
    return this.http.get<AvailableModelsResponse>(`${this.baseUrl}/models`);
  }

  /**
   * Send a message and receive streaming response via Server-Sent Events
   *
   * @param request - The chat message request
   * @returns Observable of chat stream chunks
   */
  sendMessage(request: ChatMessageRequest): Observable<ChatStreamChunk> {
    return new Observable<ChatStreamChunk>((subscriber) => {
      // Use fetch with EventSource for SSE streaming
      fetch(`${this.baseUrl}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
        .then(async (response) => {
          if (!response.ok) {
            const error = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, ${error}`);
          }

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            throw new Error('Response body is not readable');
          }

          // Read the stream
          let buffer = '';

          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            // Decode the chunk and add to buffer
            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE messages (delimited by \n\n)
            const messages = buffer.split('\n\n');
            buffer = messages.pop() || ''; // Keep incomplete message in buffer

            for (const message of messages) {
              if (message.startsWith('data: ')) {
                try {
                  const data = message.substring(6); // Remove "data: " prefix
                  const chunk: ChatStreamChunk = JSON.parse(data);
                  subscriber.next(chunk);

                  // Complete on done or error
                  if (chunk.type === 'done' || chunk.type === 'error') {
                    subscriber.complete();
                    return;
                  }
                } catch (parseError) {
                  console.error(
                    'Failed to parse SSE message:',
                    message,
                    parseError,
                  );
                }
              }
            }
          }

          subscriber.complete();
        })
        .catch((error) => {
          console.error('Stream error:', error);
          subscriber.error(error);
        });
    });
  }
}
