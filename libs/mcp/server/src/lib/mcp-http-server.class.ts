import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import * as express from 'express';

/**
 * Core HTTP server for MCP - platform agnostic
 * This can be used by both VSCode and Cursor
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
        console.log('Connecting to MCP via streamable http');
        try {
          /** Create transport */
          const transport: StreamableHTTPServerTransport =
            new StreamableHTTPServerTransport({
              sessionIdGenerator: undefined,
            });

          // handle connections closing
          res.on('close', () => {
            console.log('Request closed');
            transport.close();
            this.mcpServer.close();
          });

          // connect
          await this.mcpServer.connect(transport);

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
