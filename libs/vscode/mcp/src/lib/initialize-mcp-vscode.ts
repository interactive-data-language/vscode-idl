import { IDL_MCP_VSCODE_LOG } from '@idl/logger';
import { EXTENSION_FULL_NAME, VERSION } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { LANGUAGE_SERVER_MESSENGER, SERVER_PORTS } from '@idl/vscode/client';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { VSCodeTelemetryLogger } from '@idl/vscode/usage-metrics';
import * as vscode from 'vscode';

import { MCPHistory } from './helpers/mcp-history.class';
import { RemoveLegacyMCPConfig } from './helpers/remove-legacy-mcp-config';
import { IInitializeMCPResult } from './initialize-mcp-vscode.interface';
import { RunMCPToolMessageHandler } from './run-mcp-tool-message-handler';

export const MCP_CHANGE_EVENT_EMITTER = new vscode.EventEmitter<void>();

/**
 * Class to track history of running MCP tools
 */
export const MCP_HISTORY = new MCPHistory();

/**
 * Initializes MCP server for VSCode
 */
export function InitializeMCPVSCode(
  ctx: vscode.ExtensionContext
): IInitializeMCPResult {
  IDL_LOGGER.log({
    log: IDL_MCP_VSCODE_LOG,
    type: 'info',
    content: 'Initializing VSCode MCP server configuration',
  });

  // remove the old MCP config
  RemoveLegacyMCPConfig();

  // listen for MCP tool requests - needs to be done here to avoid circular dependencies
  LANGUAGE_SERVER_MESSENGER.onRequest(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
    RunMCPToolMessageHandler
  );

  // track notifications for MCP tools being ran
  LANGUAGE_SERVER_MESSENGER.onNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP_HISTORY,
    (params) => {
      // track history
      MCP_HISTORY.add(params.tool, params.params);

      // track usage
      VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
        idl_command: `idl.mcp.${params.tool}`,
      });
    }
  );

  /**
   * Register our MCP server with VSCode
   */
  ctx.subscriptions.push(
    vscode.lm.registerMcpServerDefinitionProvider(EXTENSION_FULL_NAME, {
      onDidChangeMcpServerDefinitions: MCP_CHANGE_EVENT_EMITTER.event,

      // Called eagerly by VS Code to discover what MCP servers your
      // extension can provide.
      async provideMcpServerDefinitions(
        token: vscode.CancellationToken
      ): Promise<undefined | vscode.McpServerDefinition[]> {
        if (token.isCancellationRequested) {
          return;
        }

        /** Create servers that we include */
        const servers: vscode.McpServerDefinition[] = [];

        servers.push(
          new vscode.McpHttpServerDefinition(
            IDL_TRANSLATION.packageJSON.displayName,
            vscode.Uri.parse(`http://localhost:${SERVER_PORTS.mcp}/mcp`),
            {},
            // VERSION
            `${VERSION}.${Math.floor(100 * Math.random())}.${Math.floor(
              100 * Math.random()
            )}.${Math.floor(100 * Math.random())}`
          )
        );

        return servers;
      },

      /**
       * Call this just before we try to run an MCP tool for our server
       */
      async resolveMcpServerDefinition(
        server: vscode.McpServerDefinition,
        token: vscode.CancellationToken
      ): Promise<undefined | vscode.McpServerDefinition> {
        if (token.isCancellationRequested) {
          return;
        }

        // try to get health check and make sure good response
        try {
          // set timeout for 2 seconds
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000); // timeout

          // attempt to fetch
          const response = await fetch(
            `http://localhost:${SERVER_PORTS.mcp}/health-check`,
            {
              method: 'GET',
              signal: controller.signal,
            }
          );

          // remove timeout
          clearTimeout(timeoutId);

          // check if we did not get a good response from the server
          if (!response.ok) {
            IDL_LOGGER.log({
              log: IDL_MCP_VSCODE_LOG,
              type: 'error',
              content: [
                'Failed to connect to MCP server',
                await response.json(),
              ],
              alert: IDL_TRANSLATION.mcp.errors.failedConnect,
            });
            return undefined;
          }

          // got here, so return server
          return server;
        } catch (err) {
          IDL_LOGGER.log({
            log: IDL_MCP_VSCODE_LOG,
            type: 'error',
            content: [
              err.name === 'AbortError'
                ? 'Failed to connect to MCP server because of connection timeout'
                : 'Unknown error while connecting to MCP server',
              err,
            ],
            alert: IDL_TRANSLATION.mcp.errors.failedConnect,
          });
          return undefined;
        }
      },
    })
  );

  return {
    history: MCP_HISTORY,
  };
}
