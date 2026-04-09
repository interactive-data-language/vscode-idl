import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ListENVIToolWorkflows,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { StartIDL } from '@idl/vscode/debug';

import { MCPEvaluateENVICommand } from '../../helpers/mcp-evaluate-envi-command';
import { MCPVerifyIDLVersion } from '../../helpers/mcp-verify-idl-version';

/**
 * Return known workflows from ENVI
 */
export async function RunMCPTool_ListENVIToolWorkflows(
  id: string,
  params: MCPToolParams<MCPTool_ListENVIToolWorkflows>,
): Promise<MCPToolResponse<MCPTool_ListENVIToolWorkflows>> {
  /**
   * Start IDL
   */
  const started = await StartIDL();

  // return if unable to start IDL
  if (!started.started) {
    return {
      success: false,
      err: started.reason,
      workflows: {},
    };
  }

  // verify version
  if (!MCPVerifyIDLVersion()) {
    return {
      success: false,
      err: IDL_TRANSLATION.mcp.errors.badIDLVersion,
      workflows: {},
    };
  }

  // start ENVI/make sure it is started
  const workflows = await MCPEvaluateENVICommand(
    `vscode_retrieveENVITaskWorkflows`,
  );

  // if we didnt succeed, then return
  if (!workflows.succeeded) {
    return {
      success: workflows.succeeded,
      err: workflows.error,
      workflows: {},
      idlOutput: workflows.idlOutput,
    };
  }

  return {
    success: started.started,
    err: workflows.error,
    workflows: workflows.payload as any,
  };
}
