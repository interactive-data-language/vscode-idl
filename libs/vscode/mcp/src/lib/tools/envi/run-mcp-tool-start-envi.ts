import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ManageIDLAndENVISession,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { StartIDL } from '@idl/vscode/debug';

import { MCPEvaluateENVICommand } from '../../helpers/mcp-evaluate-envi-command';
import { MCPVerifyIDLVersion } from '../../helpers/mcp-verify-idl-version';
import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';

/**
 * Start ENVI
 */
export async function RunMCPTool_StartENVI(
  id: string,
  params: MCPToolParams<MCPTool_ManageIDLAndENVISession>,
): Promise<MCPToolResponse<MCPTool_ManageIDLAndENVISession>> {
  VSCodeSendMCPNotification(id, { message: 'Starting IDL' });

  /**
   * Start IDL
   */
  const started = await StartIDL(false);

  // return if unable to start IDL
  if (!started.started) {
    return { success: false, err: started.reason };
  }

  // verify version
  if (!MCPVerifyIDLVersion()) {
    return {
      success: false,
      err: IDL_TRANSLATION.mcp.errors.badIDLVersion,
    };
  }

  VSCodeSendMCPNotification(id, { message: 'Starting ENVI' });

  /**
   * Check if UI or not
   */
  const headless =
    params.action === 'restart-envi-headless' ||
    params.action === 'start-envi-headless'
      ? true
      : false;

  // execute our command
  const res = await MCPEvaluateENVICommand(
    `vscode_startENVI, headless = ${headless ? '!true' : '!false'}`,
  );

  return {
    success: res.succeeded,
    err: res.error,
    idlOutput: res.idlOutput,
  };
}
