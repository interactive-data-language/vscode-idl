import { ObjectifyError } from '@idl/error-shared';
import { IDL_MCP_LOG, LogManager } from '@idl/logger';
import { SimplePromiseQueue, VERSION } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  IMCPToolProgress,
  MCPSendRequestCallback,
  MCPToolHTTPResponse,
  MCPToolInvokedCallback,
  MCPToolParams_VSCode,
  MCPToolResponse_VSCode,
  MCPTools,
  MCPTools_VSCode,
} from '@idl/types/mcp';
import {
  McpServer,
  ToolCallback,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol';
import {
  ServerNotification,
  ServerRequest,
} from '@modelcontextprotocol/sdk/types';
import express from 'express';
import { nanoid } from 'nanoid';
import { ZodRawShape } from 'zod';

import { LOCAL_IPS } from './local-ips.interface';
import {
  IMCPConnection,
  IMCPServerOptions,
  IRegisteredTool,
  MCP_SERVER_CONFIG,
  MCPRegistryToolInfo,
  MCPToolCallback,
} from './mcp-server.interface';

/**
 * Unified MCP server class that combines:
 * - HTTP server (Express) management
 * - MCP SDK server + transport lifecycle
 * - Tool registry and registration
 * - Tool execution context tracking and progress
 * - Multi-connection support (each client session gets its own SDK McpServer)
 *
 * Uses a singleton pattern accessed via static methods.
 */
export class MCPServer {
  /**
   * Returns the singleton instance. Throws if not started.
   */
  static get instance(): MCPServer {
    if (!MCPServer._instance) {
      throw new Error(
        'MCPServer has not been started. Call MCPServer.start() first.',
      );
    }
    return MCPServer._instance;
  }

  /**
   * Whether the server has been started
   */
  static get isStarted(): boolean {
    return MCPServer._instance !== undefined;
  }

  /** The singleton instance */
  private static _instance: MCPServer | undefined;

  /** Log manager */
  logManager: LogManager;

  /** Callback when a tool is invoked */
  toolInvokedCallback: MCPToolInvokedCallback<MCPTools>;

  /** Reference to express */
  private app: express.Application = express();

  /** Express app that is listening */
  private appInstance?: ReturnType<express.Application['listen']>;

  /**
   * Active client connections, keyed by session ID.
   * Each connection has its own SDK McpServer + StreamableHTTPServerTransport.
   */
  private connections = new Map<string, IMCPConnection>();

  /** Tool execution contexts that we are currently handling */
  private contexts: {
    [key: string]: RequestHandlerExtra<ServerRequest, ServerNotification>;
  } = {};

  /** Callback for error failures */
  private failCallback: (err: any) => void;

  /** Callback for when IDL or ENVI should be invoked */
  private idlExecutionCallback: MCPSendRequestCallback;

  /** Port server runs on */
  private mcpPort: number;

  /** Interval handle for idle session cleanup */
  private sessionCleanupInterval?: ReturnType<typeof setInterval>;

  /** Queue to throttle MCP server requests - only one tool runs at a time */
  private toolExecutionQueue = new SimplePromiseQueue();

  /**
   * Registry of all tools, keyed by tool name.
   * When a new connection is established, every tool in this registry
   * gets registered on that connection's SDK McpServer.
   */
  private tools: { [name: string]: IRegisteredTool } = {};

  private constructor(options: IMCPServerOptions) {
    this.logManager = options.logManager;
    this.idlExecutionCallback = options.idlExecutionCallback;
    this.toolInvokedCallback = options.toolInvokedCallback;
    this.failCallback = options.failCallback;
    this.mcpPort = options.port ?? MCP_SERVER_CONFIG.PORT;

    this.startHttpServer();
    this.startSessionCleanup();
  }

  /**
   * Create and start the singleton MCP server
   */
  static start(options: IMCPServerOptions): MCPServer {
    if (MCPServer._instance) {
      return MCPServer._instance;
    }
    MCPServer._instance = new MCPServer(options);
    return MCPServer._instance;
  }

  /**
   * Stop the singleton MCP server and clean up all connections
   */
  static stop(): void {
    if (MCPServer._instance) {
      MCPServer._instance.shutdown();
      MCPServer._instance = undefined;
    }
  }

  /**
   * Registers a tool with the MCP server and handles special logic like errors
   * and progress which individual tools shouldn't manage.
   *
   * This also manages concurrent execution of tools so that only one runs
   * at a time.
   *
   * Tools are stored in the registry and automatically registered on all
   * current and future connections.
   *
   * @param name - The tool name
   * @param info - Tool information (title, description, input schema)
   * @param cb - Callback function to execute when the tool is invoked
   */
  registerTool<Tool extends MCPTools, Args extends ZodRawShape>(
    name: Tool,
    info: MCPRegistryToolInfo<Args>,
    cb: MCPToolCallback<Args, Tool>,
  ) {
    // Prevent duplicate tool registration
    if (name in this.tools) {
      throw new Error(`MCP tool "${name}" is already registered`);
    }

    // Build the wrapped callback that handles context, queue, and errors
    const wrappedCb = (async (
      params: any,
      context: RequestHandlerExtra<ServerRequest, ServerNotification>,
    ) => {
      /** Track context */
      const id = this.registerToolExecutionContext(context);

      // write to logs
      this.logManager.log({
        log: IDL_MCP_LOG,
        type: 'info',
        content: [`Run MCP tool: "${name}" with ID "${id}"`, params],
      });

      try {
        // init result
        let res: MCPToolHTTPResponse<Tool>;

        // call invoked callback
        this.toolInvokedCallback(name, params as any);

        // run tool one at a time
        await this.toolExecutionQueue.add(async () => {
          res = await cb(id, params as any, context);
        });

        // cleanup
        this.removeToolExecutionContext(id);

        // return result
        return res;
      } catch (err) {
        // cleanup
        this.removeToolExecutionContext(id);

        // write to logs
        this.logManager.log({
          log: IDL_MCP_LOG,
          type: 'error',
          content: ['Unknown error while executing tool', err],
          alert: IDL_TRANSLATION.mcp.errors.unknownMCPToolError,
        });

        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Unknown error while running tool: ${JSON.stringify(
                ObjectifyError(err),
              )}`,
            },
          ],
        };
      }
    }) as ToolCallback<Args>;

    // Store in registry
    this.tools[name] = { info, wrappedCb };

    // Register on all active connections
    for (const conn of this.connections.values()) {
      conn.mcpServer.registerTool(name, info, wrappedCb);
    }
  }

  /**
   * Sends a request run MCP tools that require IDL or ENVI
   */
  async sendIDLRequest<T extends MCPTools_VSCode>(
    executionId: string,
    tool: T,
    params: MCPToolParams_VSCode<T>,
  ): Promise<MCPToolResponse_VSCode<T>> {
    return this.idlExecutionCallback(executionId, tool, params);
  }

  /**
   * For a given context ID, sends a notification to the agent we are interacting with
   */
  async sendToolExecutionNotification(id: string, progress: IMCPToolProgress) {
    if (id in this.contexts) {
      try {
        await this.contexts[id].sendNotification({
          method: 'notifications/message',
          params: {
            level: 'info',
            data: progress,
          },
        });
      } catch (err) {
        // filter out connection errors
        if (
          err.message !== 'Not connected' &&
          !err.message.startsWith('No connection established')
        ) {
          this.logManager.log({
            log: IDL_MCP_LOG,
            type: 'error',
            content: [
              'Error while sending tool notification',
              err,
              { id, progress },
            ],
          });
        }
      }
    }
  }

  /**
   * Notifies ALL active connections that the tool list has changed.
   * Call this after dynamically registering tools post-startup.
   */
  sendToolListChanged() {
    for (const conn of this.connections.values()) {
      try {
        conn.mcpServer.sendToolListChanged();
      } catch (err) {
        // ignore errors for connections that may have closed
      }
    }
  }

  /**
   * Create a new McpServer + transport pair, register all known tools,
   * and connect them. Returns the session ID to use for subsequent requests.
   */
  private async createConnection(): Promise<{
    sessionId: string;
    connection: IMCPConnection;
  }> {
    // Create a new SDK McpServer instance
    const mcpServer = new McpServer(
      {
        name: 'IDL for VSCode: MCP Server',
        version: VERSION,
      },
      {
        capabilities: {
          logging: {},
          resources: {},
          tools: {},
        },
      },
    );

    // Generate a new session ID
    const sessionId = nanoid();

    // Register all known tools on this new server instance
    const toolNames = Object.keys(this.tools);
    for (let i = 0; i < toolNames.length; i++) {
      const entry = this.tools[toolNames[i]];
      mcpServer.registerTool(toolNames[i], entry.info, entry.wrappedCb);
    }

    // Create transport with session management
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => sessionId,
    });

    // Connect the server to the transport
    await mcpServer.connect(transport);

    // Clean up when transport closes (client disconnect, DELETE, errors)
    transport.onclose = () => {
      this.logManager.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: `MCP transport closed with ID ${transport}`,
      });
      this.removeConnection(sessionId);
    };

    transport.onerror = (error: Error) => {
      this.logManager.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: [`MCP transport error (session: ${sessionId}):`, error],
      });
    };

    const connection: IMCPConnection = {
      lastActivity: Date.now(),
      mcpServer,
      transport,
    };
    this.connections.set(sessionId, connection);

    this.logManager.log({
      log: IDL_MCP_LOG,
      type: 'info',
      content: `New MCP connection established (session: ${sessionId})`,
    });

    return { sessionId, connection };
  }

  /**
   * Registers a context and returns an ID for the context
   */
  private registerToolExecutionContext(
    context: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ): string {
    const id = nanoid();
    this.contexts[id] = context;
    return id;
  }

  /**
   * Remove and clean up a connection by session ID
   */
  private removeConnection(sessionId: string, wasIdle = false) {
    const conn = this.connections.get(sessionId);
    if (conn) {
      // Remove from map first to prevent re-entrant cleanup from onclose
      this.connections.delete(sessionId);

      // Null out handlers to avoid loops
      conn.transport.onclose = undefined;
      conn.transport.onerror = undefined;

      try {
        conn.transport.close();
      } catch (_e) {
        // ignore
      }
      try {
        conn.mcpServer.close();
      } catch (_e) {
        // ignore
      }

      this.logManager.log({
        log: IDL_MCP_LOG,
        type: 'info',
        content: `MCP connection closed (session: ${sessionId})${wasIdle ? ' because it was idle' : ''}`,
      });
    }
  }

  /**
   * Removes a context for a running tool
   */
  private removeToolExecutionContext(id: string) {
    if (id in this.contexts) {
      delete this.contexts[id];
    }
  }

  /**
   * Shut down the server and all connections
   */
  private shutdown() {
    // Stop the idle session cleanup interval
    if (this.sessionCleanupInterval) {
      clearInterval(this.sessionCleanupInterval);
      this.sessionCleanupInterval = undefined;
    }

    // Close all connections
    for (const sessionId of this.connections.keys()) {
      this.removeConnection(sessionId);
    }

    // Close express
    if (this.appInstance) {
      this.appInstance.close();
    }
  }

  /**
   * Start the Express HTTP server with MCP endpoints
   */
  private startHttpServer() {
    // Middleware to only allow requests from localhost
    this.app.use((req: express.Request, res: express.Response, next) => {
      const ip = req.ip || req.socket.remoteAddress || '';
      const isLocalhost = ip in LOCAL_IPS || ip.startsWith('127.');

      if (!isLocalhost) {
        this.logManager.log({
          log: IDL_MCP_LOG,
          type: 'warn',
          content: `Rejected request from non-localhost IP: ${ip}`,
        });
        res
          .status(403)
          .json('Forbidden: Only localhost connections are allowed');
        return;
      }

      next();
    });

    // POST /mcp — main entry point for MCP protocol messages
    this.app.post(
      '/mcp',
      async (req: express.Request, res: express.Response) => {
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
          // Check for existing session
          const sessionId = req.headers['mcp-session-id'] as string;
          let conn: IMCPConnection;

          switch (true) {
            /**
             * Get existing session
             */
            case sessionId && this.connections.has(sessionId):
              conn = this.connections.get(sessionId);
              break;
            /**
             * Session was cleaned up, let the client know that session
             * has been closed - needs a reconnect to work again from the
             * client
             */
            case !!sessionId:
              clearInterval(keepAliveInterval);
              res.status(404).json({
                jsonrpc: '2.0',
                error: { code: -32000, message: 'Session not found' },
                id: null,
              });
              return;
            /**
             * Create new session
             */
            default: {
              const created = await this.createConnection();
              conn = created.connection;
              break;
            }
          }

          // Update last activity timestamp
          conn.lastActivity = Date.now();

          // Delegate to the transport to handle the MCP protocol message
          await conn.transport.handleRequest(req, res, req.body);
        } catch (error) {
          this.logManager.log({
            log: IDL_MCP_LOG,
            type: 'error',
            content: ['Error handling MCP request:', error],
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
      },
    );

    // GET /mcp — method not allowed
    this.app.get(
      '/mcp',
      async (req: express.Request, res: express.Response) => {
        this.logManager.log({
          log: IDL_MCP_LOG,
          type: 'debug',
          content: 'Received GET MCP request',
        });
        res.writeHead(405).end(
          JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Method not allowed.',
            },
            id: null,
          }),
        );
      },
    );

    // DELETE /mcp — client session cleanup
    this.app.delete(
      '/mcp',
      async (req: express.Request, res: express.Response) => {
        const sessionId = req.headers['mcp-session-id'] as string;

        if (sessionId && this.connections.has(sessionId)) {
          this.removeConnection(sessionId);
          res.status(200).json({ message: 'Session closed' });
        } else {
          this.logManager.log({
            log: IDL_MCP_LOG,
            type: 'debug',
            content: 'Received DELETE MCP request for unknown session',
          });
          res.writeHead(405).end(
            JSON.stringify({
              jsonrpc: '2.0',
              error: {
                code: -32000,
                message: 'Method not allowed.',
              },
              id: null,
            }),
          );
        }
      },
    );

    // GET /health-check — simple health check endpoint
    this.app.get(
      '/health-check',
      async (req: express.Request, res: express.Response) => {
        res.status(200).json({
          message: 'Server is up and running',
        });
      },
    );

    try {
      this.logManager.log({
        log: IDL_MCP_LOG,
        type: 'info',
        content: `Attempting to start MCP server on port ${this.mcpPort}`,
      });

      this.appInstance = this.app.listen(this.mcpPort, (err) => {
        this.logManager.log({
          log: IDL_MCP_LOG,
          type: 'info',
          content: `MCP server successfully started! Available at "http://localhost:${this.mcpPort}"`,
        });
      });

      this.appInstance.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          this.failCallback(error);
        } else {
          this.logManager.log({
            log: IDL_MCP_LOG,
            type: 'error',
            content: ['Failed to start MCP server:', error],
          });
        }
      });
    } catch (error) {
      this.failCallback(error);
    }
  }

  /**
   * Periodically checks for idle sessions and removes them
   */
  private startSessionCleanup() {
    this.sessionCleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [sessionId, conn] of this.connections.entries()) {
        const idle = now - conn.lastActivity;
        if (idle >= MCP_SERVER_CONFIG.SESSION_IDLE_TIMEOUT) {
          this.removeConnection(sessionId, true);
        }
      }
    }, MCP_SERVER_CONFIG.SESSION_CLEANUP_INTERVAL);
  }
}
