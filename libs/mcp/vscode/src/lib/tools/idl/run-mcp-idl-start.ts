import {
  MCPTool_IDLStart,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { StartIDL } from '@idl/vscode/debug';

/**
 * Start IDL
 */
export async function RunMCP_IDLStart(
  id: string,
  params: MCPToolParams<MCPTool_IDLStart>
): Promise<MCPToolResponse<MCPTool_IDLStart>> {
  /**
   * Start IDL
   */
  const started = await StartIDL();

  return { success: started.started, err: started.reason };
}
