import {
  IIDLExecutionBackend,
  MCPProgressCallback,
} from '@idl/mcp/idl-machine';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ManageIDLAndENVISession,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for starting ENVI.
 *
 * Independent of VS Code — works with any `IIDLExecutionBackend`.
 */
export async function StartENVISession(
  backend: IIDLExecutionBackend,
  params: MCPToolParams<MCPTool_ManageIDLAndENVISession>,
  onProgress?: MCPProgressCallback,
): Promise<MCPToolResponse<MCPTool_ManageIDLAndENVISession>> {
  onProgress?.('Starting IDL');

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

  const headless =
    params.action === 'restart-envi-headless' ||
    params.action === 'start-envi-headless'
      ? true
      : false;

  const res = await backend.evaluateENVICommand(
    `vscode_startENVI, headless = ${headless ? '!true' : '!false'}`,
  );

  return {
    success: res.succeeded,
    err: res.error,
    idlOutput: res.idlOutput,
  };
}
