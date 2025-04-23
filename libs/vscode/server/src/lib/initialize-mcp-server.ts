import { IDL_MCP_LOG } from '@idl/logger';
import { StartMCPServer } from '@idl/mcp/server';
import { RegisterAllMCPTools } from '@idl/mcp/server-tools';

import {
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_MESSENGER,
} from './initialize-server';

/**
 * Starts our MCP Server and adds all of our known tools
 */
export function InitializeMCPServer() {
  setTimeout(() => {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_MCP_LOG,
      type: 'info',
      content: 'Starting MCP server',
    });
  }, 1000);

  StartMCPServer((err) => {
    console.error(`Error from MCP server`, err);
  });

  RegisterAllMCPTools(SERVER_MESSENGER);
}
