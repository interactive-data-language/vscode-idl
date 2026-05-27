import { MCPSerializeJSON } from '@idl/mcp/common';
import {
  IIDLExecutionBackend,
  MCPProgressCallback,
} from '@idl/mcp/idl-machine';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_OpenDatasetsInENVI,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for opening datasets in ENVI.
 *
 * Independent of VS Code — works with any `IIDLExecutionBackend`.
 */
export async function OpenDatasetsInENVI(
  backend: IIDLExecutionBackend,
  params: MCPToolParams<MCPTool_OpenDatasetsInENVI>,
  onProgress?: MCPProgressCallback,
): Promise<MCPToolResponse<MCPTool_OpenDatasetsInENVI>> {
  const started = await backend.start(false);

  if (!started.started) {
    return { success: false, err: started.reason };
  }

  if (!backend.verifyIDLVersion()) {
    return {
      success: false,
      err: IDL_TRANSLATION.mcp.errors.badIDLVersion,
    };
  }

  onProgress?.('Starting ENVI');

  const start = await backend.evaluateENVICommand(`vscode_startENVI`);

  if (!start.succeeded) {
    return {
      success: start.succeeded,
      err: start.error,
      idlOutput: start.idlOutput,
    };
  }

  onProgress?.('Opening datasets');

  const res = await backend.evaluateENVICommand(
    `vscode_displayDatasets, '${MCPSerializeJSON(
      params.datasets,
    )}', automatic_zoom = '${params.automaticZoom}', reset = ${
      params.resetView ? '!true' : '!false'
    }`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.openerText, silent: false },
  );

  return {
    success: res.succeeded,
    err: res.error,
    idlOutput: res.idlOutput,
  };
}
