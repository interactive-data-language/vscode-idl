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
      result: {
        err: started?.reason || ' Failed to start',
      },
    };
  }

  if (!backend.verifyIDLVersion()) {
    return {
      success: false,
      result: { err: IDL_TRANSLATION.mcp.errors.badIDLVersion },
    };
  }

  return await backend.evaluateENVICommand<MCPTool_ListENVIToolWorkflows>(
    `vscode_retrieveENVITaskWorkflows`,
  );
}
