import { ILogOptions } from '@idl/logger';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import * as express from 'express';

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

  /** Logger for MCP server */
  private logCallback: (options: ILogOptions) => void;

  /** Port server runs on */
  private mcpPort: number;

  /** Reference to the MCP server that we will utilize */
  private mcpServer: McpServer;

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
    this.startStreamableWebServer();
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
    this.mcpServer.close();
    if (this.appInstance) {
      this.appInstance.close();
    }
  }

  /**
   * Start the streamable MCP server
   */
  private startStreamableWebServer() {
    this.app.post(
      '/mcp',
      async (req: express.Request, res: express.Response) => {
        try {
          /** Create transport */
          const transport: StreamableHTTPServerTransport =
            new StreamableHTTPServerTransport({
              sessionIdGenerator: undefined,
            });

          // connect
          await this.mcpServer.connect(transport);

          /**
           * Not sure this is 100% needed, but it was before for long-running
           * requests, so im keeping it here in case
           */
          // https://github.com/nrwl/nx-console/blob/bc58d3a5c5c661e3d1fe00248e160cb19575e7aa/apps/nx-mcp/src/main.ts#L127
          // create interval to keep connection alive
          const keepAliveInterval = setInterval(() => {
            // Check if the connection is still open using the socket's writable state
            if (!res.writableEnded && !res.writableFinished) {
              res.write(':beat\n\n');
            } else {
              // console.log('SSE connection closed, clearing keep-alive interval');
              clearInterval(keepAliveInterval);
            }
          }, MCP_SERVER_CONFIG.KEEP_ALIVE_INTERVAL);

          // handle connections closing
          res.on('close', () => {
            transport.close();
            this.mcpServer.close();
            clearInterval(keepAliveInterval);
          });

          // register request handlers
          await transport.handleRequest(req, res, req.body);
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
          content: 'Received GET MCP request which we should not',
          type: 'warn',
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
          content: 'Received DELETE MCP request which we should not',
          type: 'warn',
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

    try {
      this.logCallback({
        content: `Starting MCP server on port ${this.mcpPort}`,
        type: 'info',
      });

      this.appInstance = this.app.listen(this.mcpPort, (err) => {
        this.logCallback({
          content: `MCP server successfully started!`,
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
