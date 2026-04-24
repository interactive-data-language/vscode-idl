import { MCPSerializeJSON } from '@idl/mcp/idl';
import {
  IIDLExecutionBackend,
  MCPProgressCallback,
} from '@idl/mcp/idl-machine';
import { IDL_TRANSLATION } from '@idl/translation';
import {
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
    return { success: false, err: started.reason, outputParameters: {} };
  }

  onProgress?.('Starting ENVI');

  const start = await backend.evaluateENVICommand(`vscode_startENVI`);

  if (!start.succeeded) {
    return {
      success: start.succeeded,
      err: start.error,
      outputParameters: {},
      idlOutput: start.idlOutput,
    };
  }

  if (!backend.verifyIDLVersion()) {
    return {
      success: false,
      err: IDL_TRANSLATION.mcp.errors.badIDLVersion,
      outputParameters: {},
      idlOutput: '',
    };
  }

  onProgress?.('Running task');

  const res = await backend.evaluateENVICommand(
    `vscode_runENVITool, '${MCPSerializeJSON(params)}'`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.taskText, silent: false },
  );

  return {
    success: res.succeeded,
    err: res.error,
    outputParameters: res.payload || {},
    idlOutput: res.idlOutput,
  };
}
