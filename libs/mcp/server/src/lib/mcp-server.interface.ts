import { LogManager } from '@idl/logger';
import {
  MCPSendRequestCallback,
  MCPToolHTTPResponse,
  MCPToolInvokedCallback,
  MCPTools,
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
import { ZodRawShape } from 'zod';

/**
 * Callback that adds a new argument to each function so that
 * we have an ID we can send/receive progress messages on
 *
 * Note: We define this directly instead of inferring from ToolCallback<Args>
 * to avoid TypeScript's recursive type detection which can be triggered
 * when using nested conditional types with inference.
 */
export type MCPToolCallback<Args extends ZodRawShape, Tool extends MCPTools> = (
  id: string,
  args: import('@modelcontextprotocol/sdk/server/zod-compat').ShapeOutput<Args>,
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => MCPToolHTTPResponse<Tool> | Promise<MCPToolHTTPResponse<Tool>>;

/**
 * Parameters for registering a new tool
 */
export type MCPRegistryToolInfo<Args extends ZodRawShape> = {
  title: string;
  description: string;
  inputSchema: Args;
};

/**
 * Options for starting the MCPServer
 */
export interface IMCPServerOptions {
  /** Callback when the server encounters a fatal error */
  failCallback: (err: any) => void;
  /** Callback when IDL/ENVI tools need to run */
  idlExecutionCallback: MCPSendRequestCallback;
  /** Log manager instance */
  logManager: LogManager;
  /** Port to listen on */
  port?: number;
  /** Callback when a tool is invoked */
  toolInvokedCallback: MCPToolInvokedCallback<MCPTools>;
}

/**
 * Entry stored in the tool registry for each registered tool
 */
export interface IRegisteredTool {
  /** Tool info (title, description, inputSchema) */
  info: MCPRegistryToolInfo<any>;
  /** The wrapped callback we pass to sdk McpServer.registerTool */
  wrappedCb: ToolCallback<any>;
}

/**
 * An active MCP client connection (one SDK McpServer + transport pair)
 */
export interface IMCPConnection {
  /** The SDK McpServer instance serving this connection */
  mcpServer: McpServer;
  /** The HTTP transport bound to the SDK server */
  transport: StreamableHTTPServerTransport;
}

/**
 * URL base for messages
 */
export const MCP_MESSAGE_ENDPOINT = '/messages';

/**
 * Default port for our docs server
 */
export const MCP_SERVER_CONFIG = {
  /** Port for the MCP HTTP server */
  PORT: 4142,
  /** Milliseconds to keep connections alive */
  KEEP_ALIVE_INTERVAL: 30000,
};
