import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ENVIRunTask,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { IDL_DEBUG_ADAPTER, StartIDL } from '@idl/vscode/debug';

import { GetLastENVISuccessMessage } from '../../helpers/get-last-envi-success-message';
import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';

/**
 * Start ENVI
 */
export async function RunMCP_ENVIRunTask(
  id: string,
  params: MCPToolParams<MCPTool_ENVIRunTask>
): Promise<MCPToolResponse<MCPTool_ENVIRunTask>> {
  VSCodeSendMCPNotification(id, { message: 'Starting IDL' });

  /**
   * Start IDL
   */
  const started = await StartIDL(false);

  // return if unable to start IDL
  if (!started.started) {
    return { success: false, err: started.reason, outputParameters: {} };
  }

  VSCodeSendMCPNotification(id, { message: 'Starting ENVI' });

  // execute our command
  await IDL_DEBUG_ADAPTER.evaluate('e = envi()');

  // attempting to run ENVI task
  VSCodeSendMCPNotification(id, { message: 'Starting ENVI' });

  // run our command to open in ENVI
  const res = await IDL_DEBUG_ADAPTER.evaluate(
    `vscode_runENVITask, '${JSON.stringify(params)}'`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.taskText, silent: false }
  );

  const success = GetLastENVISuccessMessage();

  return {
    success: success.succeeded,
    err: success.error,
    outputParameters: success.payload || {},
    idlOutput: res,
  };
}
