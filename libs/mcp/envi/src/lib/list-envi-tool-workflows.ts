import { IIDLExecutionBackend } from '@idl/mcp/idl-machine';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ListENVIToolWorkflows,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for listing ENVI tool workflows.
 *
 * Independent of VS Code — works with any `IIDLExecutionBackend`.
 */
export async function ListENVIToolWorkflows(
  backend: IIDLExecutionBackend,
  params: MCPToolParams<MCPTool_ListENVIToolWorkflows>,
): Promise<MCPToolResponse<MCPTool_ListENVIToolWorkflows>> {
  const started = await backend.start();

  if (!started.started) {
    return {
      success: false,
      err: started.reason,
      workflows: {},
    };
  }

  if (!backend.verifyIDLVersion()) {
    return {
      success: false,
      err: IDL_TRANSLATION.mcp.errors.badIDLVersion,
      workflows: {},
    };
  }

  const workflows = await backend.evaluateENVICommand(
    `vscode_retrieveENVITaskWorkflows`,
  );

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
