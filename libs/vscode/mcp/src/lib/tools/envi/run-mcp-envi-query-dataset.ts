import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ENVIQueryDataset,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { StartIDL } from '@idl/vscode/debug';

import { MCPEvaluateENVICommand } from '../../helpers/mcp-evaluate-envi-command';
import { MCPSerializeJSON } from '../../helpers/mcp-serialize-json';
import { MCPVerifyIDLVersion } from '../../helpers/mcp-verify-idl-version';
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
  const started = await StartIDL(false);

  // return if unable to start IDL
  if (!started.started) {
    return { success: false, err: started.reason, info: {} };
  }

  // verify version
  if (!MCPVerifyIDLVersion()) {
    return {
      success: false,
      err: 'Requires at least IDL 9.2 and ENVI 6.2 to function',
      info: {},
    };
  }

  VSCodeSendMCPNotification(id, { message: 'Starting ENVI' });

  // start ENVI/make sure it is started
  const start = await MCPEvaluateENVICommand(`vscode_startENVI`);

  // if we didnt succeed, then return
  if (!start.succeeded) {
    return {
      success: start.succeeded,
      err: `${start.error}, IDL Output: ${start.idlOutput}`,
      info: {},
    };
  }

  // attempting to run ENVI task
  VSCodeSendMCPNotification(id, { message: 'Querying dataset' });

  // run our command to open in ENVI
  const res = await MCPEvaluateENVICommand(
    `vscode_queryDataset, '${MCPSerializeJSON(params.dataset)}'`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.queryText, silent: false }
  );

  return {
    success: res.succeeded,
    err: res.error,
    info: res.payload || {},
  };
}
