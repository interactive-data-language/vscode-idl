import {
  IIDLExecutionBackend,
  MCPProgressCallback,
} from '@idl/mcp/idl-machine';
import {
  MCPTool_ManageIDLAndENVISession,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for starting IDL.
 *
 * Independent of VS Code — works with any `IIDLExecutionBackend`.
 */
export async function StartIDLSession(
  backend: IIDLExecutionBackend,
  params: MCPToolParams<MCPTool_ManageIDLAndENVISession>,
  onProgress?: MCPProgressCallback,
): Promise<MCPToolResponse<MCPTool_ManageIDLAndENVISession>> {
  onProgress?.('Starting IDL session');

  const started = await backend.start();

  return { success: started.started, err: started.reason };
}
