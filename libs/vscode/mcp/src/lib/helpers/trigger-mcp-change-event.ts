// import { VSCODE_COMMANDS } from '@idl/types/vscode';
// import * as vscode from 'vscode';

import { MCP_CHANGE_EVENT_EMITTER } from '../initialize-mcp-vscode';

/**
 * Triggers that our MCP server has changed
 *
 * TODO: PLaceholder, but VSCode may fix some of their issues here
 */
export function TriggerMCPChangeEvent() {
  // vscode.commands.executeCommand(VSCODE_COMMANDS.REFRESH_MCP_LIST);
  MCP_CHANGE_EVENT_EMITTER.fire();
}
