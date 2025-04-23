import { MCPStartENVI, MCPToolParams, MCPToolResponse } from '@idl/types/mcp';
import { IDL_DEBUG_ADAPTER, StartIDL } from '@idl/vscode/debug';

/**
 * Open a dataset in ENVI
 */
export async function RunMCPStartENVI(
  params: MCPToolParams<MCPStartENVI>
): Promise<MCPToolResponse<MCPStartENVI>> {
  /**
   * Start IDL
   */
  const started = await StartIDL();

  // return if unable to start IDL
  if (!started) {
    return { success: false };
  }

  // execute our command
  await IDL_DEBUG_ADAPTER.evaluate(
    params.headless ? 'e = envi(/headless)' : 'e = envi()'
  );

  // we made it here, so lets return
  return { success: true };
}
