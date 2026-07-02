import { MCPSerializeJSON } from '@idl/mcp/common';
import {
  IIDLExecutionBackend,
  MCPProgressCallback,
} from '@idl/mcp/idl-machine';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  ENVIMCPToolResponse_Failure,
  MCPTool_ManageIDLAndENVISession,
  MCPTool_RunENVITool,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for running an ENVI tool.
 *
 * Independent of VS Code — works with any `IIDLExecutionBackend`.
 */
export async function RunENVITool(
  backend: IIDLExecutionBackend,
  params: MCPToolParams<MCPTool_RunENVITool>,
  onProgress?: MCPProgressCallback,
): Promise<MCPToolResponse<MCPTool_RunENVITool>> {
  onProgress?.('Starting IDL');

  const started = await backend.start(false);
  if (!started.started) {
    return {
      success: false,
      result: {
        err: started?.reason || ' Failed to start',
      },
    };
  }

  onProgress?.('Starting ENVI');

  const start =
    await backend.evaluateENVICommand<MCPTool_ManageIDLAndENVISession>(
      `vscode_startENVI`,
    );

  if (!start.success) {
    return {
      success: false,
      result: {
        err:
          (start as any as ENVIMCPToolResponse_Failure)?.result?.reason ||
          ' Failed to start',
      },
    };
  }

  onProgress?.('Running tool');

  return await backend.evaluateENVICommand<MCPTool_RunENVITool>(
    `vscode_runENVITool, '${MCPSerializeJSON(params)}'`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.taskText, silent: false },
  );
}
