import { CreateNewIDLNotebook } from '@idl/notebooks/shared';
import {
  MCPTool_CreateIDLNotebook,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { VSCODE_COMMANDS } from '@idl/types/vscode';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import * as vscode from 'vscode';

/**
 * Create an IDL Notebook!
 */
export async function RunMCPTool_CreateIDLNotebook(
  id: string,
  params: MCPToolParams<MCPTool_CreateIDLNotebook>
): Promise<MCPToolResponse<MCPTool_CreateIDLNotebook>> {
  const nbAsBytes = await CreateNewIDLNotebook(params);

  /** Make notebook folder */
  const dir = dirname(params.uri);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // make notebook and save to disk
  writeFileSync(params.uri, nbAsBytes);

  // open the notebook in vscode
  await OpenNotebookInVSCode(params.uri, true, true);

  // format the notebook
  await vscode.commands.executeCommand(VSCODE_COMMANDS.FORMAT_NOTEBOOK);

  // we made it here, so lets return
  return { success: true };
}
