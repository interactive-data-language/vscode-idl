import { CleanPath } from '@idl/idl/files';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPENVIChangeDetection,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import {
  HandleENVISuccess,
  IDL_DEBUG_ADAPTER,
  StartIDL,
} from '@idl/vscode/debug';

/**
 * Open a dataset in ENVI
 */
export async function RunMCPENVIChangeDetection(
  params: MCPToolParams<MCPENVIChangeDetection>
): Promise<MCPToolResponse<MCPENVIChangeDetection>> {
  /**
   * Start IDL
   */
  const started = await StartIDL();

  // return if unable to start IDL
  if (!started) {
    return { success: false };
  }

  // run our command to open in ENVI
  const res = await IDL_DEBUG_ADAPTER.evaluate(
    `vscode_changeDetection, '${CleanPath(params.time1Uri)}', '${CleanPath(
      params.time2Uri
    )}'`,
    { echo: true, echoThis: IDL_TRANSLATION.envi.openerText, silent: true }
  );

  // we made it here, so lets return
  return { success: await HandleENVISuccess(res) };
}
