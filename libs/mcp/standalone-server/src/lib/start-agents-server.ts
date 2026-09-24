import { IDL_AGENT_SERVER } from '@idl/logger';
import { WebSocketToolBridge } from '@idl/mcp/websocket';
import { InitializeTranslation } from '@idl/translation';
import type { IAgentServerConfig } from '@idl/types/agents';
import cors from 'cors';
import express from 'express';
import type { Server } from 'http';

import { Chat } from './chat/chat.class';
import { LoadConfigFromEnv } from './helpers/load-config-from-env';
import {
  CreateStandaloneMCPServer,
  LOG_MANAGER,
} from './mcp-tools/create-standalone-mcp-server';
import { CreateChatRoutes } from './routes/chat.routes';
import { CreateConfigRoutes } from './routes/config.routes';
import { CreateWorkflowTemplatesRoutes } from './routes/workflow-templates.routes';

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

  // WebSocket bridge for remote ENVI tool execution, always on
  const websocketBridge = new WebSocketToolBridge();

  // Initialize MCP language server (IDL indexing + MCP tools on this Express app)
  await CreateStandaloneMCPServer(app, config, { websocketBridge });

  // Initialize chat class
  const chat = new Chat(config);

  // Routes
  app.get('/', (_req, res) => {
    res.send({ message: 'Agents API Server' });
  });

  app.use('/api/chat', CreateChatRoutes(chat));
  app.use('/api/config', CreateConfigRoutes(config));
  app.use('/api/workflow-templates', CreateWorkflowTemplatesRoutes());

  // Error handling middleware
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      LOG_MANAGER.log({
        log: IDL_AGENT_SERVER,
        type: 'error',
        content: ['unhandled error:', err],
      });
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
      LOG_MANAGER.log({
        log: IDL_AGENT_SERVER,
        type: 'info',
        content: `Server ready at http://${host}:${port}`,
      });
      LOG_MANAGER.log({
        log: IDL_AGENT_SERVER,
        type: 'info',
        content: `Websocket ready at ws://${host}:${port}/ws`,
      });
      resolve(s);
    });
  });

  // Attach WebSocket bridge to the running HTTP server
  websocketBridge.attach(httpServer, '/ws');

  /**
   * Graceful shutdown: close WebSocket bridge, disconnect chat service,
   * then close the HTTP server.
   */
  const stop = async (): Promise<void> => {
    try {
      await websocketBridge.close();
      await chat.disconnect();
    } catch (err) {
      LOG_MANAGER.log({
        log: IDL_AGENT_SERVER,
        type: 'error',
        content: ['Error during shutdown:', err],
      });
    }
    await new Promise<void>((resolve, reject) => {
      httpServer.close((err) => (err ? reject(err) : resolve()));
    });
  };

  return { port, stop };
}
