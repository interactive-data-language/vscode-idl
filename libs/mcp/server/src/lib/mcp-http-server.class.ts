import { ILogOptions } from '@idl/logger';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import * as express from 'express';
import { nanoid } from 'nanoid';

import { LOCAL_IPS } from './local-ips.interface';
import { MCP_SERVER_CONFIG } from './mcp-server.interface';

/**
 * HTTP server for MCP, modeled after what the NX Console VSCode
 * extension uses.
 *
 * !! Important Note !!
 *
 * This MCP server handles concurrent requests - which is an issue
 * for some actions.
 *
 * To resolve this, the MCPToolRegistry (in libs\mcp\server-tools\src\lib\mcp-tool-registry.class.ts)
 * has a queue added for all tool executions to make sure they happen one at a time
 */
export class McpHttpServerCore {
  /** Reference to express */
  private app: express.Application = express();

  /** Express app that is listening */
  private appInstance?: ReturnType<express.Application['listen']>;

  /** Callback for error failures */
  private failCallback: (err: any) => void;

  /** Track if we've connected to the transport yet */
  private isConnected = false;

  /** Logger for MCP server */
  private logCallback: (options: ILogOptions) => void;

  /** Port server runs on */
  private mcpPort: number;

  /** Reference to the MCP server that we will utilize */
  private mcpServer: McpServer;

  /** Single transport instance that handles all HTTP requests with session management */
  private transport: StreamableHTTPServerTransport;

  constructor(
    mcpServer: McpServer,
    port: number,
    logCallback: (options: ILogOptions) => void,
    failCallback: (err: any) => void
  ) {
    this.mcpServer = mcpServer;
    this.mcpPort = port;
    this.logCallback = logCallback;
    this.failCallback = failCallback;

    // Create transport once with session management for concurrent requests
    // But don't connect yet - tools must be registered first
    this.transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => nanoid(),
    });

    this.startStreamableWebServer();
  }

  /**
   * Connect the MCP server to the transport.
   * Must be called AFTER all tools/resources/prompts are registered.
   */
  public async connectTransport(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await this.mcpServer.connect(this.transport);
      this.isConnected = true;
      this.logCallback({
        content: 'MCP server connected to transport',
        type: 'info',
      });
    } catch (err) {
      this.logCallback({
        content: ['Failed to connect MCP server to transport:', err],
        type: 'error',
      });
      this.failCallback(err);
    }
  }

  /**
   * Get the port number
   */
  public getPort(): number {
    return this.mcpPort;
  }

  /**
   * Get the URL of the server as a string
   */
  public getUrl(): string {
    return `http://localhost:${this.mcpPort}/mcp`;
  }

  /**
   * Stop MCP server
   */
  public stopMcpServer() {
    this.transport.close();
    this.mcpServer.close();
    if (this.appInstance) {
      this.appInstance.close();
    }
  }

  /**
   * Start the streamable MCP server
   */
  private startStreamableWebServer() {
    // Middleware to only allow requests from localhost
    this.app.use((req: express.Request, res: express.Response, next) => {
      const ip = req.ip || req.socket.remoteAddress || '';
      const isLocalhost = ip in LOCAL_IPS || ip.startsWith('127.');

      if (!isLocalhost) {
        this.logCallback({
          content: `Rejected request from non-localhost IP: ${ip}`,
          type: 'warn',
        });
        res
          .status(403)
          .json('Forbidden: Only localhost connections are allowed');
        return;
      }

      next();
    });

    this.app.post(
      '/mcp',
      async (req: express.Request, res: express.Response) => {
        // Ensure transport is connected before handling requests
        if (!this.isConnected) {
          await this.connectTransport();
        }

        // Create interval to keep connection alive during long-running tool executions
        // Sends SSE-style heartbeat messages to prevent timeouts
        const keepAliveInterval = setInterval(() => {
          // Check if the connection is still open using the socket's writable state
          if (!res.writableEnded && !res.writableFinished) {
            res.write(':beat\n\n');
          } else {
            clearInterval(keepAliveInterval);
          }
        }, MCP_SERVER_CONFIG.KEEP_ALIVE_INTERVAL);

        try {
          // Use the shared transport instance - it handles sessions internally
          // The transport manages concurrent requests and sessions automatically
          await this.transport.handleRequest(req, res, req.body);
        } catch (error) {
          this.logCallback({
            content: ['Error handling MCP request:', error],
            type: 'error',
          });
          if (!res.headersSent) {
            res.status(500).json({
              jsonrpc: '2.0',
              error: {
                code: -32603,
                message: 'Internal server error',
              },
              id: null,
            });
          }
        } finally {
          // Always clean up the keep-alive interval
          clearInterval(keepAliveInterval);
        }
      }
    );

    /**
     * Default response for get requests to mcp endpoint
     */
    this.app.get(
      '/mcp',
      async (req: express.Request, res: express.Response) => {
        this.logCallback({
          content: 'Received GET MCP request',
          type: 'debug',
        });
        res.writeHead(405).end(
          JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Method not allowed.',
            },
            id: null,
          })
        );
      }
    );

    /**
     * Default response for delete requests to mcp endpoint
     */
    this.app.delete(
      '/mcp',
      async (req: express.Request, res: express.Response) => {
        this.logCallback({
          content: 'Received DELETE MCP request',
          type: 'debug',
        });
        res.writeHead(405).end(
          JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Method not allowed.',
            },
            id: null,
          })
        );
      }
    );

    /**
     * Health check endpoint to make sure server is running
     */
    this.app.get(
      '/health-check',
      async (req: express.Request, res: express.Response) => {
        this.logCallback({
          content: 'Received health check request',
          type: 'debug',
        });
        res.status(200).json({
          message: 'Server is up and running',
        });
      }
    );

    try {
      this.logCallback({
        content: `Attempting to start MCP server on port ${this.mcpPort}`,
        type: 'info',
      });

      this.appInstance = this.app.listen(this.mcpPort, (err) => {
        this.logCallback({
          content: `MCP server successfully started! Available at "http://localhost:${this.mcpPort}"`,
          type: 'info',
        });
      });

      this.appInstance.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          this.failCallback(error);
        } else {
          this.logCallback({
            content: ['Failed to start MCP server:', error],
            type: 'error',
          });
        }
      });
    } catch (error) {
      this.failCallback(error);
    }
  }
}
