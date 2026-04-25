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
    const chatService = new ChatService(env.OPENAI_API_KEY, port);

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
