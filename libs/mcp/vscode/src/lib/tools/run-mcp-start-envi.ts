import {
  MCPTool_StartENVI,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { IDL_DEBUG_ADAPTER, StartIDL } from '@idl/vscode/debug';

import { VSCodeSendMCPNotification } from '../helpers/vscode-send-mcp-notification';

/**
 * Start ENVI
 */
export async function RunMCPStartENVI(
  id: string,
  params: MCPToolParams<MCPTool_StartENVI>
): Promise<MCPToolResponse<MCPTool_StartENVI>> {
  VSCodeSendMCPNotification(id, { message: 'Starting IDL' });

  /**
   * Start IDL
   */
  const started = await StartIDL();

  // return if unable to start IDL
  if (!started.started) {
    return { success: false, err: started.reason };
  }

  VSCodeSendMCPNotification(id, { message: 'Starting ENVI' });

  // execute our command
  await IDL_DEBUG_ADAPTER.evaluate(
    params.headless ? 'e = envi(/headless)' : 'e = envi()'
  );

  // we made it here, so lets return
  return { success: true };
}
