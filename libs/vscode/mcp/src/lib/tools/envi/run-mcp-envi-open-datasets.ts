import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ENVIOpenDatasets,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { StartIDL } from '@idl/vscode/debug';

import { MCPEvaluateENVICommand } from '../../helpers/mcp-evaluate-envi-command';
import { MCPSerializeJSON } from '../../helpers/mcp-serialize-json';
import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';

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

  VSCodeSendMCPNotification(id, { message: 'Starting ENVI' });

  // start ENVI/make sure it is started
  const start = await MCPEvaluateENVICommand(`vscode_startENVI`);

  // if we didnt succeed, then return
  if (!start.succeeded) {
    return {
      success: start.succeeded,
      err: start.error,
      idlOutput: start.idlOutput,
    };
  }

  VSCodeSendMCPNotification(id, { message: 'Opening datasets' });

  // run our command to open in ENVI
  const res = await MCPEvaluateENVICommand(
    // datasets are already serialized as a string
    `vscode_displayDatasets, '${MCPSerializeJSON(
      params.datasets
    )}', automatic_zoom = '${params.automaticZoom}', reset = ${
      params.resetView ? '!true' : '!false'
    }`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.openerText, silent: false }
  );

  return {
    success: res.succeeded,
    err: res.error,
    idlOutput: res.idlOutput,
  };
}
