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
    return {
      success: false,
      result: { err: started?.reason || 'Failed to start' },
    };
  }

  if (!backend.verifyIDLVersion()) {
    return {
      success: false,
      result: { err: IDL_TRANSLATION.mcp.errors.badIDLVersion },
    };
  }

  onProgress?.('Starting ENVI');

  const headless = false;
  // params.action === 'restart-envi-headless' ||
  // params.action === 'start-envi-headless'
  //   ? true
  //   : false;

  return await backend.evaluateENVICommand<MCPTool_ManageIDLAndENVISession>(
    `vscode_startENVI, headless = ${headless ? '!true' : '!false'}`,
  );
}
