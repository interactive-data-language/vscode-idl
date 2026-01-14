import {
  MCPTool_ENVIStart,
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

  // verify version
  if (!MCPVerifyIDLVersion()) {
    return {
      success: false,
      err: 'Requires at least IDL 9.2 and ENVI 6.2 to function',
    };
  }

  VSCodeSendMCPNotification(id, { message: 'Starting ENVI' });

  // execute our command
  const res = await MCPEvaluateENVICommand(
    `vscode_startENVI, headless = ${params.headless ? '!true' : '!false'}`
  );

  return {
    success: res.succeeded,
    err: res.error,
    idlOutput: res.idlOutput,
  };
}
