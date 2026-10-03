import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import {
  MCPSendRequestCallback,
  MCPToolHTTPResponse,
  MCPToolInvokedCallback,
  MCPTools,
} from '@idl/types/mcp';
import { NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node';
import {
  Icon,
  McpServer,
  ServerContext,
  ToolCallback,
} from '@modelcontextprotocol/server';
import type { Application } from 'express';
import { z, ZodRawShape } from 'zod';

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
  args: z.infer<z.ZodObject<Args>>,
  extra: ServerContext,
) => MCPToolHTTPResponse<Tool> | Promise<MCPToolHTTPResponse<Tool>>;

/**
 * Parameters for registering a new tool
 */
export type MCPRegistryToolInfo<Args extends ZodRawShape> = {
  title: string;
  description: string;
  inputSchema: Args;
  icons?: Icon[];
};

/**
 * Options for starting the MCPServer
 */
export interface IMCPServerOptions {
  /** Optional external Express app to mount MCP routes on (skips creating a standalone server) */
  app?: Application;
  /** Callback when the server encounters a fatal error */
  failCallback: (err: any) => void;
  /** Callback when an MCP tool runs that requires communication with IDL or ENVI */
  idlExecutionCallback: MCPSendRequestCallback;
  /** Reference to the IDL index which does parsing */
  idlIndex: IDLIndex;
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
  /** Tool info (title, description, inputSchema) after conversion to a full Zod object schema */
  info: MCPRegistryToolInfo<any>;
  /** The wrapped callback we pass to sdk McpServer.registerTool */
  wrappedCb: ToolCallback<z.ZodObject<ZodRawShape>>;
}

/**
 * A single-request MCP connection (one SDK McpServer + transport pair),
 * built and torn down per request in stateless mode
 */
export interface IMCPConnection {
  /** The SDK McpServer instance serving this request */
  mcpServer: McpServer;
  /** The HTTP transport bound to the SDK server */
  transport: NodeStreamableHTTPServerTransport;
}

// /**
//  * Icons for IDL tools
//  *
//  * VS Code doesn't seem to support this
//  */
// export const MCP_IDL_ICONS: Icon[] = [
//   {
//     src: `data:image/svg+xml;base64,${readFileSync(GetExtensionPath('resources/images/dark/idlicon-color.svg'), 'base64')}`,
//     mimeType: 'image/svg+xml',
//     theme: 'dark',
//   },
//   {
//     src: `data:image/svg+xml;base64,${readFileSync(GetExtensionPath('resources/images/light/idlicon-color.svg'), 'base64')}`,
//     mimeType: 'image/svg+xml',
//     theme: 'light',
//   },
// ];

// /**
//  * Icons for ENVI tools
//  *
//  * VS Code doesn't seem to support this
//  */
// export const MCP_ENVI_ICONS: Icon[] = [
//   {
//     src: `data:image/svg+xml;base64,${readFileSync(GetExtensionPath('resources/images/dark/enviicon-color.svg'), 'base64')}`,
//     mimeType: 'image/svg+xml',
//     theme: 'dark',
//   },
//   {
//     src: `data:image/svg+xml;base64,${readFileSync(GetExtensionPath('resources/images/light/enviicon-color.svg'), 'base64')}`,
//     mimeType: 'image/svg+xml',
//     theme: 'light',
//   },
// ];

/**
 * Default port for our docs server
 */
export const MCP_SERVER_CONFIG = {
  /** Port for the MCP HTTP server */
  PORT: 4142,
  /** Milliseconds to keep connections alive */
  KEEP_ALIVE_INTERVAL: 30000,
};
