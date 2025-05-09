import { IDL_MCP_LOG } from '@idl/logger';
import { StartMCPServer } from '@idl/mcp/server';
import { RegisterAllMCPResources } from '@idl/mcp/server-resources';
import { RegisterAllMCPTools } from '@idl/mcp/server-tools';
import { IDL_TRANSLATION } from '@idl/translation';

import { MCP_CONFIG } from './helpers/merge-config';
import {
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_MESSENGER,
} from './initialize-server';

/**
 * Starts our MCP Server and adds all of our known tools
 */
export function InitializeMCPServer() {
  if (!MCP_CONFIG.enabled) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_MCP_LOG,
      type: 'info',
      content: `Skipping MCP server startup (disabled in user settings)`,
    });
    return;
  }

  try {
    // alert user
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_MCP_LOG,
      type: 'info',
      content: `Starting MCP server on port ${MCP_CONFIG.port}`,
    });

    // indicate that we are starting the MCP server
    StartMCPServer((err) => {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: ['Error starting server', err],
        alert: IDL_TRANSLATION.lsp.errors.startingServer,
      });
    }, MCP_CONFIG.port);

    // register all of our tools
    RegisterAllMCPTools(SERVER_MESSENGER);
    RegisterAllMCPResources(SERVER_MESSENGER);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_MCP_LOG,
      type: 'error',
      content: ['Error initializing MCP server', err],
      alert: IDL_TRANSLATION.lsp.errors.startingServer,
    });
  }
}
