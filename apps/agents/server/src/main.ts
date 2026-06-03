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

/**
 * Additional allowed web origins (comma-separated). Loopback origins are always
 * allowed; anything else must be listed in `AGENTS_ALLOWED_ORIGINS`. Replaces
 * the previous `origin: true` config that reflected ANY origin with
 * credentials, letting any website drive the local agent server cross-origin.
 */
const EXTRA_ALLOWED_ORIGINS = (process.env.AGENTS_ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

/** Returns whether a browser Origin may call this server. */
function isAllowedOrigin(origin?: string): boolean {
  if (!origin) {
    return true;
  }
  let hostname = origin.replace(/^[a-z]+:\/\//i, '');
  const slash = hostname.indexOf('/');
  if (slash !== -1) {
    hostname = hostname.slice(0, slash);
  }
  if (hostname.startsWith('[')) {
    const end = hostname.indexOf(']');
    hostname = end !== -1 ? hostname.slice(1, end) : hostname;
  } else {
    const colon = hostname.lastIndexOf(':');
    if (colon !== -1) {
      hostname = hostname.slice(0, colon);
    }
  }
  hostname = hostname.toLowerCase();
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1'
  ) {
    return true;
  }
  return EXTRA_ALLOWED_ORIGINS.includes(origin);
}

async function main() {
  try {
    const app = express();

    // Middleware — restrict CORS to loopback (plus AGENTS_ALLOWED_ORIGINS)
    app.use(
      cors({
        origin: (origin, callback) =>
          callback(null, isAllowedOrigin(origin)),
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
