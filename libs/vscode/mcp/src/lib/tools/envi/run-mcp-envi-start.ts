import {
  MCPTool_ENVIStart,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { IDL_DEBUG_ADAPTER, StartIDL } from '@idl/vscode/debug';

import { GetLastENVISuccessMessage } from '../../helpers/get-last-envi-success-message';
import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';

/**
 * Start ENVI
 */
export async function RunMCP_ENVIStart(
  id: string,
  params: MCPToolParams<MCPTool_ENVIStart>
): Promise<MCPToolResponse<MCPTool_ENVIStart>> {
  VSCodeSendMCPNotification(id, { message: 'Starting IDL' });

  /**
   * Start IDL
   */
  const started = await StartIDL(false);

  // return if unable to start IDL
  if (!started.started) {
    return { success: false, err: started.reason };
  }

  VSCodeSendMCPNotification(id, { message: 'Starting ENVI' });

  // execute our command
  const res = await IDL_DEBUG_ADAPTER.evaluate(
    `vscode_startENVI, headless = ${params.headless ? '!true' : '!false'}`
  );

  const success = GetLastENVISuccessMessage();

  return {
    success: success.succeeded,
    err: success.error,
    idlOutput: res,
  };
}
