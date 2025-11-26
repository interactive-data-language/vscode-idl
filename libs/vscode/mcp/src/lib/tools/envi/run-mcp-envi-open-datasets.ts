import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ENVIOpenDatasets,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { IDL_DEBUG_ADAPTER, StartIDL } from '@idl/vscode/debug';

import { GetLastENVISuccessMessage } from '../../helpers/get-last-envi-success-message';

/**
 * Open a dataset in ENVI
 */
export async function RunMCP_ENVIOpenDatasets(
  id: string,
  params: MCPToolParams<MCPTool_ENVIOpenDatasets>
): Promise<MCPToolResponse<MCPTool_ENVIOpenDatasets>> {
  /**
   * Start IDL
   */
  const started = await StartIDL(false);

  // return if unable to start IDL
  if (!started.started) {
    return { success: false, err: started.reason };
  }

  // run our command to open in ENVI
  const res = await IDL_DEBUG_ADAPTER.evaluate(
    // datasets are already serialized as a string
    `vscode_displayDatasets, '${params.datasets}', reset = ${
      params.resetView ? '!true' : '!false'
    }`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.openerText, silent: false }
  );

  const success = GetLastENVISuccessMessage();

  return {
    success: success.succeeded,
    err: success.error,
    idlOutput: res,
  };
}
