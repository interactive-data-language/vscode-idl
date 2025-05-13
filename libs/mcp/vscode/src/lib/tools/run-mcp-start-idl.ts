import {
  MCPTool_StartIDL,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { StartIDL } from '@idl/vscode/debug';

/**
 * Start IDL
 */
export async function RunMCPStartIDL(
  id: string,
  params: MCPToolParams<MCPTool_StartIDL>
): Promise<MCPToolResponse<MCPTool_StartIDL>> {
  /**
   * Start IDL
   */
  const started = await StartIDL();

  return { success: started.started, err: started.reason };
}
