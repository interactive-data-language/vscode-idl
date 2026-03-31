import { IDL_MCP_LOG } from '@idl/logger';
import {
  MCPTrackResources,
  RegisterAllLanguageServerMCPTools,
} from '@idl/mcp/language-server-tools';
import { MCPServer } from '@idl/mcp/server';
import { RegisterStaticMCPResources } from '@idl/mcp/server-resources';
import { RegisterAllMCPTools } from '@idl/mcp/server-tools';
import { IDL_TRANSLATION } from '@idl/translation';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';

import { IDL_INDEX } from '../events/initialize-document-manager';
import { MCP_CONFIG } from '../helpers/merge-config';
import { GetWorkspaceFolders } from '../helpers/workspace-folders';
import {
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_MESSENGER,
} from '../initialize-language-server';
import { RegisterMCPPromptTools } from './register-mcp-prompt-tools';

/**
 * Starts our MCP Server and adds all of our known tools
 */
export function InitializeMCPServer(port: number, isEnviInstalled: boolean) {
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
    // start the unified MCP server
    MCPServer.start({
      port,
      logManager: IDL_LANGUAGE_SERVER_LOGGER,
      idlExecutionCallback: (executionId, tool, params) => {
        return SERVER_MESSENGER.sendRequest(
          LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
          {
            id: executionId,
            tool,
            params,
          },
        ) as any;
      },
      toolInvokedCallback: (tool, params) => {
        SERVER_MESSENGER.sendNotification(
          LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP_HISTORY,
          {
            tool,
            params,
          },
        );
      },
      failCallback: (err) => {
        IDL_LANGUAGE_SERVER_LOGGER.log({
          log: IDL_MCP_LOG,
          type: 'error',
          content: ['Error starting server', err],
          alert: IDL_TRANSLATION.mcp.errors.failedStart,
        });
      },
    });

    /** Get reference to the server singleton */
    const mcpServer = MCPServer.instance;

    // register static resources (documentation links)
    RegisterStaticMCPResources();

    // track dynamic file-based resources
    try {
      MCPTrackResources(IDL_LANGUAGE_SERVER_LOGGER);
    } catch (err) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: [`Problem tracking resource files`, err],
      });
    }

    // register all of our tools
    RegisterAllMCPTools(isEnviInstalled);

    // register all tools that require the language server (IDL Index) to function
    RegisterAllLanguageServerMCPTools(
      mcpServer,
      IDL_INDEX,
      GetWorkspaceFolders,
    );

    // listen for progress notifications
    SERVER_MESSENGER.onNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP_PROGRESS,
      (msg) => {
        try {
          mcpServer.sendToolExecutionNotification(msg.id, msg.progress);
        } catch (err) {
          IDL_LANGUAGE_SERVER_LOGGER.log({
            log: IDL_MCP_LOG,
            type: 'error',
            content: ['Error while handling MCP progress notification', err],
            alert: IDL_TRANSLATION.mcp.errors.failedProgress,
          });
        }
      },
    );

    // add all prompts as server resources
    try {
      RegisterMCPPromptTools(mcpServer);
    } catch (err) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: [`Problem registering prompts`, err],
      });
    }

    return mcpServer;
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_MCP_LOG,
      type: 'error',
      content: ['Error initializing MCP server', err],
      alert: IDL_TRANSLATION.mcp.errors.failedStart,
    });
  }
}
