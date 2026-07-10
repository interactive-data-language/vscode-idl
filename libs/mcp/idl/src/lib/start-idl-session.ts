import {
  IIDLMCPExecutionBackend,
  MCPProgressCallback,
  MCPTool_ManageIDLAndENVISession,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for starting IDL.
 *
 * Independent of VS Code — works with any `IIDLMCPExecutionBackend`.
 */
export async function StartIDLSession(
  backend: IIDLMCPExecutionBackend,
  params: MCPToolParams<MCPTool_ManageIDLAndENVISession>,
  onProgress?: MCPProgressCallback,
): Promise<MCPToolResponse<MCPTool_ManageIDLAndENVISession>> {
  onProgress?.('Starting IDL session');

  const started = await backend.start();

  return started.started
    ? { success: true, result: 'Started IDL' }
    : { success: false, result: { err: started?.reason || 'Failed to start' } };
}
