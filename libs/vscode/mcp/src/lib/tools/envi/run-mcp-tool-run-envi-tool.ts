import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_RunENVITool,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { StartIDL } from '@idl/vscode/debug';

import { MCPEvaluateENVICommand } from '../../helpers/mcp-evaluate-envi-command';
import { MCPSerializeJSON } from '../../helpers/mcp-serialize-json';
import { MCPVerifyIDLVersion } from '../../helpers/mcp-verify-idl-version';
import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';

/**
 * Run a tool in ENVI
 */
export async function RunMCPTool_RunENVITool(
  id: string,
  params: MCPToolParams<MCPTool_RunENVITool>
): Promise<MCPToolResponse<MCPTool_RunENVITool>> {
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

  // start ENVI/make sure it is started
  const start = await MCPEvaluateENVICommand(`vscode_startENVI`);

  // if we didnt succeed, then return
  if (!start.succeeded) {
    return {
      success: start.succeeded,
      err: start.error,
      outputParameters: {},
      idlOutput: start.idlOutput,
    };
  }

  // verify version
  if (!MCPVerifyIDLVersion()) {
    return {
      success: false,
      err: IDL_TRANSLATION.mcp.errors.badIDLVersion,
      outputParameters: {},
      idlOutput: '',
    };
  }

  // attempting to run ENVI task
  VSCodeSendMCPNotification(id, { message: 'Running task' });

  // run our command to open in ENVI
  const res = await MCPEvaluateENVICommand(
    `vscode_runENVITask, '${MCPSerializeJSON(params)}'`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.taskText, silent: false }
  );

  return {
    success: res.succeeded,
    err: res.error,
    outputParameters: res.payload || {},
    idlOutput: res.idlOutput,
  };
}
