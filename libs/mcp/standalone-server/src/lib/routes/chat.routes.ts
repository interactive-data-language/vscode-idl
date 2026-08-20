import type { ChatMessageRequest } from '@idl/types/chat';
import { Router } from 'express';

import { ChatService } from '../services/chat.service';

/**
 * Create chat routes
 */
export function createChatRoutes(chatService: ChatService): Router {
  const router = Router();

  /**
   * GET /api/chat/models
   * Returns list of available models from the configured provider.
   */
  router.get('/models', async (_req, res) => {
    try {
      const models = await chatService.listModels();
      res.json({ models });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to list models',
      });
    }
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

      // Stream the response — let the generator run to exhaustion so the
      // optional 'title' chunk (emitted after 'done') is also sent.
      for await (const chunk of chatService.streamChatCompletion(request)) {
        // Format as SSE
        const sseData = `data: ${JSON.stringify(chunk)}\n\n`;
        res.write(sseData);

        // End immediately on errors
        if (chunk.type === 'error') {
          res.end();
          return;
        }
      }

      // Generator exhausted — close the connection
      res.end();
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
