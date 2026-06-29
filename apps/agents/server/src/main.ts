import cors from 'cors';
import express from 'express';

import { validateEnv } from './config/env.config';
import { MCPLanguageServer } from './language-server/mcp-language-server';
import { createChatRoutes } from './routes/chat.routes';
import { ChatService } from './services/chat.service';

// Validate environment variables
const env = validateEnv();

const host = env.HOST;
const port = Number(env.PORT);

async function main() {
  try {
    const app = express();

    // Middleware
    app.use(
      cors({
        origin: true, // Allow all origins in development (proxy handles this)
        credentials: true,
      }),
    );
    app.use(express.json());

    // Initialize MCP language server (IDL indexing + MCP tools on this Express app)
    await MCPLanguageServer(app);

    // Initialize services
    const chatService = new ChatService({
      chatEngine: env.CHAT_ENGINE,
      copilotGitHubToken: env.COPILOT_GITHUB_TOKEN,
      ollamaBaseUrl: env.OLLAMA_BASE_URL,
      openaiApiKey: env.OPENAI_API_KEY,
      provider: env.CHAT_PROVIDER,
      serverPort: port,
    });

    // Graceful shutdown — stop the Copilot SDK client so on-disk state flushes
    const shutdown = async (signal: NodeJS.Signals) => {
      console.log(`[server] Received ${signal}, shutting down...`);
      try {
        await chatService.disconnect();
      } catch (err) {
        console.error('[server] Error during shutdown:', err);
      } finally {
        process.exit(0);
      }
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // Routes
    app.get('/', (_req, res) => {
      res.send({ message: 'Agents API Server' });
    });

    app.use('/api/chat', createChatRoutes(chatService));

    // Error handling middleware
    app.use(
      (
        err: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        console.error('Unhandled error:', err);
        res.status(500).json({
          error: 'Internal server error',
          message: err.message,
        });
      },
    );

    app.listen(port, host, () => {
      console.log(`[ ready ] http://${host}:${port}`);
      console.log(`[ info ] chat provider: ${env.CHAT_PROVIDER}`);
      console.log(`[ info ] chat engine:   ${env.CHAT_ENGINE}`);
      console.log(`[ info ] API endpoints:`);
      console.log(`         - GET  /api/chat/models`);
      console.log(`         - POST /api/chat/message`);
      console.log(`         - POST /mcp (MCP protocol)`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
