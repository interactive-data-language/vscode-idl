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

  /** Port server runs on */
  private mcpPort: number;

  /** Reference to the MCP server that we will utilize */
  private mcpServer: McpServer;

  constructor(mcpServer: McpServer, port: number) {
    this.mcpServer = mcpServer;
    this.mcpPort = port;
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
          console.log('Error handling MCP request:', error);
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
        console.log('Received GET MCP request');
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
        console.log('Received DELETE MCP request');
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
      this.appInstance = this.app.listen(this.mcpPort, () => {
        console.log(`MCP server started on port ${this.mcpPort}`);
      });

      this.appInstance.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          console.log(
            `Port ${this.mcpPort} is already in use. Another VS Code/Cursor instance likely has an MCP server running on this port.`
          );
        } else {
          console.log(`Failed to start MCP server: ${error.message}`);
        }
      });
    } catch (error) {
      // This catch might not be necessary with the error event handler, but keeping for safety
      console.log(`Failed to start MCP server: ${error}`);
    }
  }
}
