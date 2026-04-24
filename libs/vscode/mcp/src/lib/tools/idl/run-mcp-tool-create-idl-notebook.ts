import { CreateIDLNotebook } from '@idl/mcp/idl';
import {
  MCPTool_CreateIDLNotebook,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { VSCODE_COMMANDS } from '@idl/types/vscode';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';
import * as vscode from 'vscode';

/**
 * Create an IDL Notebook (VS Code wrapper)
 *
 * Delegates notebook creation to the core `CreateIDLNotebook`
 * function, then opens and formats it in VS Code.
 */
export async function RunMCPTool_CreateIDLNotebook(
  id: string,
  params: MCPToolParams<MCPTool_CreateIDLNotebook>,
): Promise<MCPToolResponse<MCPTool_CreateIDLNotebook>> {
  // create the notebook file on disk
  const result = await CreateIDLNotebook(params);

  if (!result.success) {
    return result;
  }

  // open the notebook in vscode
  await OpenNotebookInVSCode(params.uri, true, true);

  // format the notebook
  await vscode.commands.executeCommand(VSCODE_COMMANDS.FORMAT_NOTEBOOK);

  return { success: true };
}
