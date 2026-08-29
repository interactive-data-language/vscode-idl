import type {
  AvailableModelsResponse,
  ChatInstructionsResponse,
  ChatMessageRequest,
  ExamplePromptsResponse,
} from '@idl/types/chat';
import { Router } from 'express';

import { Chat } from '../chat/chat.class';

/**
 * Idle time (in milliseconds) with no bytes written to an SSE response before
 * a keepalive comment is sent to prevent proxy/connection timeouts.
 */
const KEEPALIVE_INTERVAL_MS = 15000;

/**
 * Create chat routes
 */
export function CreateChatRoutes(chat: Chat): Router {
  const router = Router();

  /**
   * GET /api/chat/models
   * Returns list of available models from the configured provider.
   */
  router.get('/models', async (_req, res) => {
    try {
      const models = await chat.listModels();
      const defaultModel = await chat.defaultModelID();
      const resp: AvailableModelsResponse = {
        models,
        defaultModelID: defaultModel,
      };

      res.json(resp);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to list models',
      });
    }
  });

  /**
   * GET /api/chat/example-prompts
   * Returns the configured list of example prompts for the welcome screen.
   */
  router.get('/example-prompts', (_req, res) => {
    try {
      const resp: ExamplePromptsResponse = {
        prompts: chat.listExamplePrompts(),
      };

      res.json(resp);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to list example prompts',
      });
    }
  });

  /**
   * GET /api/chat/instructions
   * Returns the configured list of chat instruction options and the default selection.
   */
  router.get('/instructions', (_req, res) => {
    try {
      const resp: ChatInstructionsResponse = chat.listChatInstructions();

      res.json(resp);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to list instructions',
      });
    }
  });

  /**
   * POST /api/chat/:sessionId/cancel
   * Interrupts the in-flight turn for a session without closing the session
   * itself, so follow-up messages keep full context.
   */
  router.post('/:sessionId/cancel', async (req, res) => {
    try {
      await chat.cancelSession(req.params.sessionId);
      res.status(204).end();
    } catch (error) {
      console.error('Error in /:sessionId/cancel endpoint:', error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'Failed to cancel session',
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

      // Sends an SSE comment (ignored by clients) whenever nothing has been
      // written for a while, so long tool calls don't trip a proxy timeout.
      let lastWriteTime = Date.now();
      const keepaliveTimer = setInterval(() => {
        if (Date.now() - lastWriteTime >= KEEPALIVE_INTERVAL_MS) {
          res.write(': keepalive\n\n');
          lastWriteTime = Date.now();
        }
      }, KEEPALIVE_INTERVAL_MS);

      // Fallback for clients that abort the fetch/connection directly instead
      // of calling the explicit cancel endpoint (e.g. tab closed mid-stream).
      // `cancelSession` is idempotent, so a race with the explicit call is safe.
      req.on('close', () => {
        if (!res.writableEnded) {
          chat.cancelSession(request.sessionId).catch((err) => {
            console.error('Error cancelling session on close:', err);
          });
        }
      });

      try {
        // Stream the response — let the generator run to exhaustion so the
        // optional 'title' chunk (emitted after 'done') is also sent.
        for await (const chunk of chat.streamChatCompletion(request)) {
          // Format as SSE
          const sseData = `data: ${JSON.stringify(chunk)}\n\n`;
          res.write(sseData);
          lastWriteTime = Date.now();

          // End immediately on errors or cancellation
          if (chunk.type === 'error' || chunk.type === 'cancelled') {
            res.end();
            return;
          }
        }

        // Generator exhausted — close the connection
        res.end();
      } finally {
        clearInterval(keepaliveTimer);
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
