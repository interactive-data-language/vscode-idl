import {
  MCPTool_StartIDL,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { StartIDL } from '@idl/vscode/debug';

/**
 * Open a dataset in ENVI
 */
export async function RunMCPStartIDL(
  params: MCPToolParams<MCPTool_StartIDL>
): Promise<MCPToolResponse<MCPTool_StartIDL>> {
  /**
   * Start IDL
   */
  const started = await StartIDL();

  // return if unable to start IDL
  if (!started) {
    return { success: false };
  }

  // we made it here, so lets return
  return { success: true };
}
