import { WebSocketToolBridge } from '@idl/mcp/websocket';
import cors from 'cors';
import express from 'express';
import type { Server } from 'http';

import type { ChatEngine, ChatProvider } from './config/env.config';
import { CreateStandaloneMCPServer } from './mcp-tools/create-standalone-mcp-server';
import { createChatRoutes } from './routes/chat.routes';
import { ChatService } from './services/chat.service';

/**
 * Options for starting the full agents server (Express + MCP + chat routes).
 */
export interface IStartAgentsServerOptions {
  /** Which chat engine to use. Defaults to `copilot`. */
  chatEngine?: ChatEngine;
  /** Which chat provider backend to use. Defaults to `openai`. */
  chatProvider?: ChatProvider;
  /** GitHub token for the Copilot SDK client. */
  copilotGitHubToken?: string;
  /** Server hostname. Defaults to `localhost`. */
  host?: string;
  /** Base URL for a local Ollama instance. Defaults to `http://localhost:11434`. */
  ollamaBaseUrl?: string;
  /** OpenAI API key. Required when `chatProvider === 'openai'`. */
  openaiApiKey?: string;
  /** TCP port to listen on. Defaults to `3000`. */
  port?: number;
  /** When true, tool execution is routed through a WebSocket bridge at `/ws`. */
  websocketEnabled?: boolean;
}

/**
 * Result returned by `StartAgentsServer`. Call `stop()` to gracefully shut
 * down the HTTP server, WebSocket bridge, and chat service.
 */
export interface IStartAgentsServerResult {
  /** Gracefully shut down the server and all associated resources. */
  stop: () => Promise<void>;
}

/**
 * Start the full agents server: Express app with CORS, JSON middleware,
 * MCP routes (IDL language server + tools), and the `/api/chat` routes.
 *
 * This is the single entry point shared by both the Node.js server app and
 * the Electron desktop app.
 */
export async function StartAgentsServer(
  options: IStartAgentsServerOptions = {},
): Promise<IStartAgentsServerResult> {
  const {
    chatEngine,
    chatProvider = 'openai',
    copilotGitHubToken,
    host = 'localhost',
    ollamaBaseUrl = 'http://localhost:11434',
    openaiApiKey,
    port = 3000,
    websocketEnabled = false,
  } = options;

  const app = express();

  // Middleware
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());

  // Optional WebSocket bridge for remote tool execution
  const websocketBridge = websocketEnabled
    ? new WebSocketToolBridge()
    : undefined;

  // Initialize MCP language server (IDL indexing + MCP tools on this Express app)
  await CreateStandaloneMCPServer(app, { websocketBridge });

  // Initialize chat service
  const chatService = new ChatService({
    chatEngine,
    copilotGitHubToken,
    ollamaBaseUrl,
    openaiApiKey,
    provider: chatProvider,
    serverPort: port,
    websocketMode: websocketEnabled,
  });

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

  // Start listening
  const httpServer: Server = await new Promise((resolve) => {
    const s = app.listen(port, host, () => {
      console.log(`[ ready ] http://${host}:${port}`);
      console.log(`[ info ] chat provider: ${chatProvider}`);
      console.log(`[ info ] chat engine:   ${chatEngine ?? 'copilot'}`);
      console.log(`[ info ] API endpoints:`);
      console.log(`         - GET  /api/chat/models`);
      console.log(`         - POST /api/chat/message`);
      console.log(`         - POST /mcp (MCP protocol)`);
      if (websocketBridge !== undefined) {
        console.log(`         - WS   ws://${host}:${port}/ws (bridge)`);
      }
      resolve(s);
    });
  });

  // Attach WebSocket bridge to the running HTTP server
  if (websocketBridge !== undefined) {
    websocketBridge.attach(httpServer, '/ws');
  }

  /**
   * Graceful shutdown: close WebSocket bridge, disconnect chat service,
   * then close the HTTP server.
   */
  const stop = async (): Promise<void> => {
    try {
      if (websocketBridge !== undefined) {
        await websocketBridge.close();
      }
      await chatService.disconnect();
    } catch (err) {
      console.error('[server] Error during shutdown:', err);
    }
    await new Promise<void>((resolve, reject) => {
      httpServer.close((err) => (err ? reject(err) : resolve()));
    });
  };

  return { stop };
}
