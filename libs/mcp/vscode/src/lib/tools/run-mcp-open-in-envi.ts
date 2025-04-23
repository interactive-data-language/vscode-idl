import { MCPOpenInENVI, MCPToolParams, MCPToolResponse } from '@idl/types/mcp';
import { OpenInENVI, StartIDL } from '@idl/vscode/debug';

/**
 * Open a dataset in ENVI
 */
export async function RunMCPOpenInENVI(
  params: MCPToolParams<MCPOpenInENVI>
): Promise<MCPToolResponse<MCPOpenInENVI>> {
  /**
   * Start IDL
   */
  const started = await StartIDL();

  // return if unable to start IDL
  if (!started) {
    return { success: false };
  }

  // we made it here, so lets return
  return { success: await OpenInENVI(params.uri) };
}
