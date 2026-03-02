import { IDL_MCP_LOG } from '@idl/logger';
import {
  MCPTrackResources,
  RegisterAllLanguageServerMCPTools,
} from '@idl/mcp/language-server-tools';
import { StartMCPServer } from '@idl/mcp/server';
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
    const mcpToolHelper = RegisterAllMCPTools(
      SERVER_MESSENGER,
      IDL_LANGUAGE_SERVER_LOGGER,
      (tool, params) => {
        SERVER_MESSENGER.sendNotification(
          LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP_HISTORY,
          {
            tool,
            params,
          }
        );
      },
      isEnviInstalled
    );

    // register all tools that require the language server (IDL Index) to function
    RegisterAllLanguageServerMCPTools(
      mcpToolHelper,
      IDL_INDEX,
      GetWorkspaceFolders
    );

    // listen for progress notifications
    SERVER_MESSENGER.onNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP_PROGRESS,
      (msg) => {
        try {
          mcpToolHelper.sendToolExecutionNotification(msg.id, msg.progress);
        } catch (err) {
          IDL_LANGUAGE_SERVER_LOGGER.log({
            log: IDL_MCP_LOG,
            type: 'error',
            content: ['Error while handling MCP progress notification', err],
            alert: IDL_TRANSLATION.mcp.errors.failedProgress,
          });
        }
      }
    );

    // add all prompts as server resources
    try {
      RegisterMCPPromptTools(mcpToolHelper);
    } catch (err) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: [`Problem registering prompts`, err],
      });
    }

    return mcpToolHelper;
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_MCP_LOG,
      type: 'error',
      content: ['Error initializing MCP server', err],
      alert: IDL_TRANSLATION.mcp.errors.failedStart,
    });
  }
}
