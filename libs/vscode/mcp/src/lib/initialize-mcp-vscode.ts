import { IDL_MCP_VSCODE_LOG } from '@idl/logger';
import { EXTENSION_FULL_NAME, VERSION } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { LANGUAGE_SERVER_MESSENGER, SERVER_PORTS } from '@idl/vscode/client';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { IDL_LOGGER } from '@idl/vscode/logger';
import * as vscode from 'vscode';

import { RemoveLegacyMCPConfig } from './helpers/remove-legacy-mcp-config';
import { RunMCPToolMessageHandler } from './run-mcp-tool-message-handler';

export const MCP_CHANGE_EVENT_EMITTER = new vscode.EventEmitter<void>();

/**
 * Initializes MCP server for VSCode
 */
export function InitializeMCPVSCode(ctx: vscode.ExtensionContext) {
  IDL_LOGGER.log({
    log: IDL_MCP_VSCODE_LOG,
    type: 'info',
    content: 'Initiailizing VSCode MCP server configuration',
  });

  // remove the old MCP config
  RemoveLegacyMCPConfig();

  // listen for MCP tool requests - needs to be done here to avoid circular dependencies
  LANGUAGE_SERVER_MESSENGER.onRequest(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
    RunMCPToolMessageHandler
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
            `${VERSION}.${Math.floor(100 * Math.random())}.${Math.floor(
              100 * Math.random()
            )}.${Math.floor(100 * Math.random())}`
          )
        );

        return servers;
      },

      //   // Optional: called right before a server is started.
      //   // Use this if you need user interaction (auth, config, etc.).
      //   async resolveMcpServerDefinition(
      //     server: vscode.McpServerDefinition,
      //     token: vscode.CancellationToken
      //   ): Promise<undefined | vscode.McpServerDefinition> {
      //     if (token.isCancellationRequested) {
      //       return;
      //     }

      //     // Example: ask for an API key the first time starting a specific server
      //     if (server.label === 'github') {
      //       const apiKey = await vscode.window.showInputBox({
      //         prompt: 'Enter API key for GitHub MCP server',
      //         password: true,
      //         ignoreFocusOut: true,
      //       });

      //       if (!apiKey) {
      //         // Returning undefined tells VS Code: "don't start this server"
      //         return;
      //       }

      //       // For an HTTP server, you’d typically clone & tweak headers:
      //       if (server instanceof vscode.McpHttpServerDefinition) {
      //         return new vscode.McpHttpServerDefinition(
      //           server.label,
      //           server.uri,
      //           {
      //             ...server.headers,
      //             Authorization: `Bearer ${apiKey}`,
      //           },
      //           server.version
      //         );
      //       }
      //     }

      //     // By default just return the server unchanged
      //     return server;
      //   },
    })
  );
}
