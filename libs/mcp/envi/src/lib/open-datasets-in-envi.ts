import { MCPSerializeJSON } from '@idl/mcp/common';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  ENVIMCPToolResponse_Failure,
  IIDLMCPExecutionBackend,
  MCPProgressCallback,
  MCPTool_ManageIDLAndENVISession,
  MCPTool_OpenDatasetsInENVI,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for opening datasets in ENVI.
 *
 * Independent of VS Code — works with any `IIDLMCPExecutionBackend`.
 */
export async function OpenDatasetsInENVI(
  backend: IIDLMCPExecutionBackend,
  params: MCPToolParams<MCPTool_OpenDatasetsInENVI>,
  onProgress?: MCPProgressCallback,
): Promise<MCPToolResponse<MCPTool_OpenDatasetsInENVI>> {
  const started = await backend.start(false);
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

  onProgress?.('Opening datasets');

  return await backend.evaluateENVICommand<MCPTool_OpenDatasetsInENVI>(
    `vscode_displayDatasets, '${MCPSerializeJSON(
      params.datasets,
    )}', automatic_zoom = '${params.automaticZoom}', reset = ${
      params.resetView ? '!true' : '!false'
    }`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.openerText, silent: false },
  );
}
