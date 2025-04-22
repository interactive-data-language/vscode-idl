import { MCPOpenInENVI, MCPToolParams, MCPToolResponse } from '@idl/types/mcp';

import { StartIDL } from '../../commands/start-idl';
import { IDL_DEBUG_ADAPTER } from '../../initialize-debugger';

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

  // execute our command
  await IDL_DEBUG_ADAPTER.evaluate('e = envi()');

  // we made it here, so lets return
  return { success: true };
}
