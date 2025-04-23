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

  return { success: started.started, err: started.reason };
}
