import { ILogOptions } from '@idl/logger';
import { VERSION } from '@idl/shared/extension';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { McpHttpServerCore } from './mcp-http-server.class';
import { MCP_SERVER_CONFIG } from './mcp-server.interface';

/**
 * Check if server is started or not
 */
export let IS_MCP_SERVER_STARTED = false;

/**
 * MCP server instance
 */
export let MCP_SERVER: McpServer;

/**
 * Starts an express server for to serve up static docs content
 */
export function StartMCPServer(
  port = MCP_SERVER_CONFIG.PORT,
  logCallback: (options: ILogOptions) => void,
  failCallback: (err: any) => void
) {
  /**
   * Return if already started
   */
  if (IS_MCP_SERVER_STARTED) {
    return;
  }

  // Initialize MCP server
  MCP_SERVER = new McpServer(
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
    }
  );

  /**
   * Start express and turn the server on
   */
  const MCP_HTTP = new McpHttpServerCore(
    MCP_SERVER,
    port,
    logCallback,
    failCallback
  );

  /** update flag that the server started */
  IS_MCP_SERVER_STARTED = true;
}
