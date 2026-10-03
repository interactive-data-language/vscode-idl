import { ObjectifyError } from '@idl/error-shared';
import { IDL_MCP_LOG, LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { SimplePromiseQueue, VERSION } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  IMCPToolProgress,
  MCPSendRequestCallback,
  MCPToolHTTPResponse,
  MCPToolInvokedCallback,
  MCPToolParams,
  MCPToolResponse,
  MCPTools,
  MCPTools_IDL,
} from '@idl/types/mcp';
import { NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node';
import {
  McpServer,
  ServerContext,
  ToolCallback,
} from '@modelcontextprotocol/server';
import express from 'express';
import { nanoid } from 'nanoid';
import { z, ZodRawShape } from 'zod';

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
 * - Stateless connections (each request gets its own short-lived SDK McpServer)
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

  /** Access IDL index */
  idlIndex: IDLIndex;

  /** Log manager */
  logManager: LogManager;

  /** Callback when a tool is invoked */
  toolInvokedCallback: MCPToolInvokedCallback<MCPTools>;

  /** Reference to express */
  private app: express.Application;

  /** Express app that is listening */
  private appInstance?: ReturnType<express.Application['listen']>;

  /** Tool execution contexts that we are currently handling */
  private contexts: {
    [key: string]: ServerContext;
  } = {};

  /** Callback for error failures */
  private failCallback: (err: any) => void;

  /** Callback for when IDL or ENVI should be invoked */
  private idlExecutionCallback: MCPSendRequestCallback;

  /** Port server runs on */
  private mcpPort: number;

  /** Queue to throttle MCP server requests - only one tool runs at a time */
  private toolExecutionQueue = new SimplePromiseQueue();

  /**
   * Registry of all tools, keyed by tool name.
   * When a new connection is established, every tool in this registry
   * gets registered on that connection's SDK McpServer.
   */
  private tools: { [name: string]: IRegisteredTool } = {};

  /** Whether we are using an externally-provided Express app */
  private usingExternalApp: boolean;

  private constructor(options: IMCPServerOptions) {
    this.logManager = options.logManager;
    this.idlExecutionCallback = options.idlExecutionCallback;
    this.idlIndex = options.idlIndex;
    this.toolInvokedCallback = options.toolInvokedCallback;
    this.failCallback = options.failCallback;
    this.mcpPort = options.port ?? MCP_SERVER_CONFIG.PORT;
    this.app = options.app ?? express();
    this.usingExternalApp = !!options.app;

    this.startHttpServer();
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
      params: z.infer<z.ZodObject<Args>>,
      context: ServerContext,
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
        let res!: MCPToolHTTPResponse<Tool>;

        // call invoked callback
        this.toolInvokedCallback(name, params);

        // run tool one at a time
        await this.toolExecutionQueue.add(async () => {
          res = await cb(id, params, context);
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
                ObjectifyError(err as Error),
              )}`,
            },
          ],
        };
      }
    }) as ToolCallback<z.ZodObject<ZodRawShape>>;

    // try setting tool icons
    // this.tools[name].info.icons = MCP_IDL_ICONS;

    // Store in registry
    // tools are added when connections are made
    this.tools[name] = {
      info: {
        ...info,
        inputSchema: z.strictObject(info.inputSchema),
      },
      wrappedCb,
    };
  }

  /**
   * Sends a request run MCP tools that require IDL or ENVI
   */
  async sendIDLRequest<T extends MCPTools_IDL>(
    executionId: string,
    tool: T,
    params: MCPToolParams<T>,
  ): Promise<MCPToolResponse<T>> {
    return this.idlExecutionCallback(executionId, tool, params);
  }

  /**
   * For a given context ID, sends a notification to the agent we are interacting with
   */
  async sendToolExecutionNotification(id: string, progress: IMCPToolProgress) {
    if (id in this.contexts) {
      try {
        await this.contexts[id].mcpReq.notify({
          method: 'notifications/message',
          params: {
            level: 'info',
            data: progress,
          },
        });
      } catch (err) {
        // filter out connection errors
        if (
          (err as Error).message !== 'Not connected' &&
          !(err as Error).message.startsWith('No connection established')
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
   * No-op kept for callers that register tools post-startup.
   *
   * In stateless mode there are no persistent connections to notify - every
   * request builds a brand-new McpServer from the current tool registry, so
   * the client always sees up-to-date tools without an explicit notification.
   */
  sendToolListChanged() {
    // intentionally empty
  }

  /**
   * Closes a single-request connection's transport and server
   */
  private closeMCPInstanceAndConnection(conn: IMCPConnection) {
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
  }

  /**
   * Create a new McpServer + transport pair for a single request and
   * register all known tools. Stateless: no session ID, nothing cached.
   */
  private async createMCPInstanceAndConnection(): Promise<IMCPConnection> {
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

    // Register all known tools on this new server instance
    const toolNames = Object.keys(this.tools);
    for (let i = 0; i < toolNames.length; i++) {
      const entry = this.tools[toolNames[i]];
      mcpServer.registerTool(toolNames[i], entry.info, entry.wrappedCb);
    }

    // Stateless transport - no session ID tracking across requests
    const transport = new NodeStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    transport.onerror = (error: Error) => {
      this.logManager.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: ['MCP transport error:', error],
      });
    };

    // Connect the server to the transport
    await mcpServer.connect(transport);

    return { mcpServer, transport };
  }

  /**
   * Registers a context and returns an ID for the context
   */
  private registerToolExecutionContext(context: ServerContext): string {
    const id = nanoid();
    this.contexts[id] = context;
    return id;
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
   * Shut down the server
   */
  private shutdown() {
    // Close express
    if (this.appInstance) {
      this.appInstance.close();
    }
  }

  /**
   * Start the Express HTTP server with MCP endpoints
   */
  private startHttpServer() {
    /** Localhost restriction middleware */
    const localhostMiddleware = (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const ip = req.ip || req.socket.remoteAddress || '';

      // debug info for HTTP requests to help track down issues
      this.logManager.log({
        log: IDL_MCP_LOG,
        type: 'debug',
        content: [
          'Incoming MCP request',
          {
            method: req.method,
            endpoint: req.originalUrl,
            protocolMethod: req.body?.method,
            requestId: req.body?.id,
            toolName: req.body?.params?.name,
            headers: req.headers,
          },
        ],
      });

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
    };

    /**
     * When using an external Express app, create a Router for MCP routes
     * so localhost middleware only applies to MCP endpoints.
     * When standalone, register routes directly on the app.
     */
    const router = this.usingExternalApp ? express.Router() : this.app;

    // Parse MCP JSON-RPC requests before logging or handling the routes.
    router.use(express.json());

    // Apply localhost middleware to MCP routes
    router.use(localhostMiddleware);

    /**
     * Stateless handler for MCP requests
     *
     * Creates a new MCP instance and connection for each request
     */
    router.post('/mcp', async (req: express.Request, res: express.Response) => {
      /** MCP connection, scoped to this request only */
      const conn = await this.createMCPInstanceAndConnection();

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

      // Tear down the per-request connection once the response is done
      res.on('close', () => {
        clearInterval(keepAliveInterval);
        if (conn) {
          this.closeMCPInstanceAndConnection(conn);
        }
      });

      try {
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
      }
    });

    // GET /mcp — method not allowed, stateless servers don't support the SSE stream
    router.get('/mcp', async (req: express.Request, res: express.Response) => {
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
    });

    // DELETE /mcp — method not allowed, there are no sessions to close
    router.delete(
      '/mcp',
      async (req: express.Request, res: express.Response) => {
        this.logManager.log({
          log: IDL_MCP_LOG,
          type: 'debug',
          content: 'Received DELETE MCP request',
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

    // GET /health-check — simple health check endpoint
    router.get(
      '/health-check',
      async (req: express.Request, res: express.Response) => {
        res.status(200).json({
          message: 'Server is up and running',
        });
      },
    );

    // Mount the router on the external app
    if (this.usingExternalApp) {
      this.app.use(router as express.Router);
      this.logManager.log({
        log: IDL_MCP_LOG,
        type: 'info',
        content: 'MCP routes mounted on external Express app',
      });
    } else {
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
  }
}
