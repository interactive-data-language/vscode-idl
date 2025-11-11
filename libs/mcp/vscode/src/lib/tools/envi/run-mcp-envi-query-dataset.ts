import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ENVIQueryDataset,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { IDL_DEBUG_ADAPTER, StartIDL } from '@idl/vscode/debug';

import { GetLastENVISuccessMessage } from '../../helpers/get-last-envi-success-message';
import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';

/**
 * Open a dataset in ENVI
 */
export async function RunMCP_ENVIQueryDataset(
  id: string,
  params: MCPToolParams<MCPTool_ENVIQueryDataset>
): Promise<MCPToolResponse<MCPTool_ENVIQueryDataset>> {
  VSCodeSendMCPNotification(id, { message: 'Starting IDL' });

  /**
   * Start IDL
   */
  const started = await StartIDL();

  // return if unable to start IDL
  if (!started.started) {
    return { success: false, err: started.reason, info: {} };
  }

  VSCodeSendMCPNotification(id, { message: 'Starting ENVI' });

  // execute our command
  await IDL_DEBUG_ADAPTER.evaluate('e = envi()');

  // attempting to run ENVI task
  VSCodeSendMCPNotification(id, { message: 'Starting ENVI' });

  // run our command to open in ENVI
  const res = await IDL_DEBUG_ADAPTER.evaluate(
    `vscode_queryDataset, '${JSON.stringify(params.dataset)}'`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.queryText, silent: false }
  );

  // TODO: double check IDL finished successfully

  const success = GetLastENVISuccessMessage();

  return {
    success: success.succeeded,
    err: success.error,
    info: success.payload || {},
  };
}
