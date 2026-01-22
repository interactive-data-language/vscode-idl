import { IDL_MCP_LOG } from '@idl/logger';
import {
  MCPTrackTutorialsAsResources,
  RegisterAllLanguageServerMCPTools,
} from '@idl/mcp/language-server';
import { StartMCPServer } from '@idl/mcp/server';
import { RegisterAllMCPResources } from '@idl/mcp/server-resources';
import { MCP_TOOL_CONTEXT, RegisterAllMCPTools } from '@idl/mcp/server-tools';
import { IDL_TRANSLATION } from '@idl/translation';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';

import { IDL_INDEX } from './events/initialize-document-manager';
import { MCP_CONFIG } from './helpers/merge-config';
import {
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_MESSENGER,
} from './initialize-language-server';

/**
 * Starts our MCP Server and adds all of our known tools
 */
export function InitializeMCPServer(port: number) {
  // check if it is disabled or not
  if (!MCP_CONFIG.enabled) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_MCP_LOG,
      type: 'info',
      content: `Skipping MCP server startup (disabled in user/workspace settings)`,
    });
    return;
  }

  // check for port
  if (port === -1) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_MCP_LOG,
      type: 'warn',
      content: `MCP port specified as "${port}", port is invalid so skipping MCP startup`,
    });
    return;
  }

  try {
    // indicate that we are starting the MCP server
    StartMCPServer(
      port,
      (logThis) => {
        IDL_LANGUAGE_SERVER_LOGGER.log({ ...logThis, ...{ log: IDL_MCP_LOG } });
      },
      (err) => {
        IDL_LANGUAGE_SERVER_LOGGER.log({
          log: IDL_MCP_LOG,
          type: 'error',
          content: ['Error starting server', err],
          alert: IDL_TRANSLATION.mcp.errors.failedStart,
        });
      }
    );

    // register all of our resources
    RegisterAllMCPResources(SERVER_MESSENGER);

    // add all tutorials as server resources
    try {
      MCPTrackTutorialsAsResources(IDL_LANGUAGE_SERVER_LOGGER);
    } catch (err) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: [`Problem tracking IDL tutorial files`, err],
      });
    }

    // register all of our tools
    RegisterAllMCPTools(SERVER_MESSENGER, IDL_LANGUAGE_SERVER_LOGGER);

    // register all tools that require the language server (IDL Index) to function
    RegisterAllLanguageServerMCPTools(
      SERVER_MESSENGER,
      IDL_INDEX,
      IDL_LANGUAGE_SERVER_LOGGER
    );

    // listen for progress notifications
    SERVER_MESSENGER.onNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP_PROGRESS,
      (msg) => {
        try {
          MCP_TOOL_CONTEXT.sendNotification(msg.id, msg.progress);
        } catch (err) {
          IDL_LANGUAGE_SERVER_LOGGER.log({
            log: IDL_MCP_LOG,
            type: 'error',
            content: ['Error handling MCP progress notification', err],
            alert: IDL_TRANSLATION.mcp.errors.failedProgress,
          });
        }
      }
    );
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_MCP_LOG,
      type: 'error',
      content: ['Error initializing MCP server', err],
      alert: IDL_TRANSLATION.mcp.errors.failedStart,
    });
  }
}
