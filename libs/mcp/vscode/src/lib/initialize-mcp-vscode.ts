import { LANGUAGE_SERVER_MESSENGER } from '@idl/vscode/client';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import * as vscode from 'vscode';

import { RunMCPToolMessageHandler } from './run-mcp-tool-message-handler';

/**
 * Initializes everything to allow for a debug session of IDL
 */
export function InitializeMCPVSCode(ctx: vscode.ExtensionContext) {
  // listen for MCP tool requests - needs to be done here to avoid circular dependencies
  LANGUAGE_SERVER_MESSENGER.onRequest(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
    RunMCPToolMessageHandler
  );
}
