import {
  MCPTool_OpenInENVI,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { OpenInENVI, StartIDL } from '@idl/vscode/debug';

/**
 * Open a dataset in ENVI
 */
export async function RunMCPOpenInENVI(
  id: string,
  params: MCPToolParams<MCPTool_OpenInENVI>
): Promise<MCPToolResponse<MCPTool_OpenInENVI>> {
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
