import { MCPSerializeJSON } from '@idl/mcp/common';
import { FixENVIFactory } from '@idl/mcp/envi-to-mcp';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  ENVIMCPToolResponse_Failure,
  IIDLMCPExecutionBackend,
  MCPProgressCallback,
  MCPTool_ManageIDLAndENVISession,
  MCPTool_QueryDatasetWithENVI,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for querying a dataset with ENVI.
 *
 * Independent of VS Code — works with any `IIDLMCPExecutionBackend`.
 */
export async function QueryDatasetWithENVI(
  backend: IIDLMCPExecutionBackend,
  params: MCPToolParams<MCPTool_QueryDatasetWithENVI>,
  onProgress?: MCPProgressCallback,
): Promise<MCPToolResponse<MCPTool_QueryDatasetWithENVI>> {
  // Pick the dataset that was provided
  const dataset =
    params.raster ??
    params.vector ??
    params.roi ??
    params.spectralLibrary ??
    params.deepLearningModel ??
    params.machineLearningModel;

  // Validate that exactly one dataset was passed in
  if (!dataset) {
    return {
      success: false,
      result: {
        err: 'No dataset provided. Specify exactly one of: raster, vector, roi, spectralLibrary, deepLearningModel, or machineLearningModel.',
      },
    };
  }

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

  onProgress?.('Querying dataset');

  const res = await backend.evaluateENVICommand<MCPTool_QueryDatasetWithENVI>(
    `vscode_queryDataset, '${MCPSerializeJSON(dataset)}'`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.queryText, silent: false },
  );

  if (!res.result) {
    res.result = [{}];
  }

  FixENVIFactory(res.result);

  return res;
}
