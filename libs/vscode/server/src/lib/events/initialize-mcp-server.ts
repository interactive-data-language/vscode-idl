import { IDL_MCP_LOG } from '@idl/logger';
import {
  MCPTrackPromptsAsResources,
  MCPTrackTutorialsAsResources,
  RegisterAllLanguageServerMCPTools,
} from '@idl/mcp/language-server';
import { StartMCPServer } from '@idl/mcp/server';
import { RegisterAllMCPResources } from '@idl/mcp/server-resources';
import { RegisterAllMCPTools } from '@idl/mcp/server-tools';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';

import { MCP_CONFIG } from '../helpers/merge-config';
import { SendUsageMetricServer } from '../helpers/send-usage-metric-server';
import {
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_MESSENGER,
} from '../initialize-language-server';
import { IDL_INDEX } from './initialize-document-manager';

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

    // add all prompts as server resources
    try {
      MCPTrackPromptsAsResources(IDL_LANGUAGE_SERVER_LOGGER);
    } catch (err) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: [`Problem tracking GitHub Copilot prompt files`, err],
      });
    }

    // register all of our tools
    const mcpToolHelper = RegisterAllMCPTools(
      SERVER_MESSENGER,
      IDL_LANGUAGE_SERVER_LOGGER,
      (toolName) => {
        SendUsageMetricServer(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
          idl_command: `idl.mcp.${toolName}`,
        });
      },
      isEnviInstalled
    );

    // register all tools that require the language server (IDL Index) to function
    RegisterAllLanguageServerMCPTools(mcpToolHelper, IDL_INDEX);

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
