import { WebSocketToolBridge } from '@idl/mcp/websocket';
import { InitializeTranslation } from '@idl/translation';
import type { IAgentServerConfig } from '@idl/types/agents';
import cors from 'cors';
import express from 'express';
import type { Server } from 'http';

import { Chat } from './chat/chat.class';
import { LoadConfigFromEnv } from './helpers/load-config-from-env';
import { CreateStandaloneMCPServer } from './mcp-tools/create-standalone-mcp-server';
import { CreateChatRoutes } from './routes/chat.routes';
import { CreateConfigRoutes } from './routes/config.routes';

/**
 * Result returned by `StartAgentsServer`. Call `stop()` to gracefully shut
 * down the HTTP server, WebSocket bridge, and chat service.
 */
export interface IStartAgentsServerResult {
  /** TCP port the server is listening on. */
  port: number;
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
  config: IAgentServerConfig,
): Promise<IStartAgentsServerResult> {
  // check the environment for configuration
  LoadConfigFromEnv(config);

  // start the express app
  const app = express();

  // load translation
  InitializeTranslation(config.server.language);

  // Middleware
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());

  // Optional WebSocket bridge for remote tool execution
  const websocketBridge =
    config.processing.mode === 'websocket'
      ? new WebSocketToolBridge()
      : undefined;

  // Initialize MCP language server (IDL indexing + MCP tools on this Express app)
  await CreateStandaloneMCPServer(app, { websocketBridge });

  // Initialize chat class
  const chat = new Chat(config);

  // Routes
  app.get('/', (_req, res) => {
    res.send({ message: 'Agents API Server' });
  });

  app.use('/api/chat', CreateChatRoutes(chat));
  app.use('/api/config', CreateConfigRoutes(config));

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

  const { host, port } = config.server;

  // Start listening
  const httpServer: Server = await new Promise((resolve) => {
    const s = app.listen(port, host, () => {
      console.log(`[ ready ] http://${host}:${port}`);
      console.log(`[ info ] chat provider: ${config.agent.llm.model}`);
      console.log(`[ info ] chat engine:   ${config.agent.engine}`);
      console.log(`[ info ] API endpoints:`);
      console.log(`         - GET  /api/chat/models`);
      console.log(`         - POST /api/chat/message`);
      console.log(`         - GET  /api/config`);
      console.log(`         - PUT  /api/config`);
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
      await chat.disconnect();
    } catch (err) {
      console.error('[server] Error during shutdown:', err);
    }
    await new Promise<void>((resolve, reject) => {
      httpServer.close((err) => (err ? reject(err) : resolve()));
    });
  };

  return { port, stop };
}
