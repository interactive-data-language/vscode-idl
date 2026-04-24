import { FixENVIFactory } from '@idl/mcp/envi-to-mcp';
import { MCPSerializeJSON } from '@idl/mcp/idl';
import {
  IIDLExecutionBackend,
  MCPProgressCallback,
} from '@idl/mcp/idl-machine';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_QueryDatasetWithENVI,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for querying a dataset with ENVI.
 *
 * Independent of VS Code — works with any `IIDLExecutionBackend`.
 */
export async function QueryDatasetWithENVI(
  backend: IIDLExecutionBackend,
  params: MCPToolParams<MCPTool_QueryDatasetWithENVI>,
  onProgress?: MCPProgressCallback,
): Promise<MCPToolResponse<MCPTool_QueryDatasetWithENVI>> {
  onProgress?.('Starting IDL');

  const started = await backend.start(false);

  if (!started.started) {
    return { success: false, err: started.reason, info: [{}] };
  }

  if (!backend.verifyIDLVersion()) {
    return {
      success: false,
      err: IDL_TRANSLATION.mcp.errors.badIDLVersion,
      info: [{}],
    };
  }

  onProgress?.('Starting ENVI');

  const start = await backend.evaluateENVICommand(`vscode_startENVI`);

  if (!start.succeeded) {
    return {
      success: start.succeeded,
      err: `${start.error}, IDL Output: ${start.idlOutput}`,
      info: [{}],
    };
  }

  onProgress?.('Querying dataset');

  const res = await backend.evaluateENVICommand(
    `vscode_queryDataset, '${MCPSerializeJSON(params.dataset)}'`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.queryText, silent: false },
  );

  if (!res.payload) {
    res.payload = [{}];
  }

  FixENVIFactory(res.payload);

  return {
    success: res.succeeded,
    err: res.error,
    info: res.payload,
  };
}
