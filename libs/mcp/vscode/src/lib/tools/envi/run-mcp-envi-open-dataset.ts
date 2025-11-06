import {
  MCPTool_ENVIOpenDataset,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { OpenInENVI, StartIDL } from '@idl/vscode/debug';

/**
 * Open a dataset in ENVI
 */
export async function RunMCP_ENVIOpenDataset(
  id: string,
  params: MCPToolParams<MCPTool_ENVIOpenDataset>
): Promise<MCPToolResponse<MCPTool_ENVIOpenDataset>> {
  /**
   * Start IDL
   */
  const started = await StartIDL();

  // return if unable to start IDL
  if (!started.started) {
    return { success: false, err: started.reason };
  }

  // we made it here, so lets return
  return { success: await OpenInENVI(params.uri) };
}
