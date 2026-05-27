import { CreateNewIDLNotebook } from '@idl/notebooks/shared';
import {
  MCPTool_CreateIDLNotebook,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

/**
 * Core logic for creating an IDL Notebook.
 *
 * Writes the notebook file to disk. Does not open it in any editor —
 * the VS Code wrapper handles opening and formatting.
 */
export async function CreateIDLNotebook(
  params: MCPToolParams<MCPTool_CreateIDLNotebook>,
): Promise<MCPToolResponse<MCPTool_CreateIDLNotebook>> {
  const nbAsBytes = await CreateNewIDLNotebook(params);

  const dir = dirname(params.uri);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(params.uri, nbAsBytes);

  return { success: true };
}
