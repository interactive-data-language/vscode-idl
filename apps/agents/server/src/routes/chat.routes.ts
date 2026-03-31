import type {
  AvailableModelsResponse,
  ChatMessageRequest,
} from '@idl/types/chat';
import { Router } from 'express';

import { ChatService } from '../services/chat.service';

/**
 * Available OpenAI models for chat completions
 */
const AVAILABLE_MODELS: AvailableModelsResponse = {
  models: [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      description: 'Most capable model, best for complex tasks',
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      description: 'Fast and affordable, great for most tasks',
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Legacy model, fastest and cheapest',
    },
  ],
};

/**
 * Create chat routes
 */
export function createChatRoutes(chatService: ChatService): Router {
  const router = Router();

  /**
   * GET /api/chat/models
   * Returns list of available models
   */
  router.get('/models', (_req, res) => {
    res.json(AVAILABLE_MODELS);
  });

  /**
   * POST /api/chat/message
   * Streams chat completion using Server-Sent Events (SSE)
   */
  router.post('/message', async (req, res) => {
    try {
      const request = req.body as ChatMessageRequest;

      // Validate request
      if (!request.message || !request.model || !request.sessionId) {
        res.status(400).json({
          error: 'Missing required fields: message, model, sessionId',
        });
        return;
      }

      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

      // Stream the response
      for await (const chunk of chatService.streamChatCompletion(request)) {
        // Format as SSE
        const sseData = `data: ${JSON.stringify(chunk)}\n\n`;
        res.write(sseData);

        // End connection if done or error
        if (chunk.type === 'done' || chunk.type === 'error') {
          res.end();
          break;
        }
      }
    } catch (error) {
      console.error('Error in /message endpoint:', error);

      // Send error event if headers not sent yet
      if (!res.headersSent) {
        res.status(500).json({
          error:
            error instanceof Error ? error.message : 'Internal server error',
        });
      } else {
        // Send error as SSE if already streaming
        res.write(
          `data: ${JSON.stringify({
            type: 'error',
            content: '',
            error:
              error instanceof Error ? error.message : 'Internal server error',
          })}\n\n`,
        );
        res.end();
      }
    }
  });

  return router;
}
