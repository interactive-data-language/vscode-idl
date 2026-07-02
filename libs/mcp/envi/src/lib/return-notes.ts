import { IIDLExecutionBackend } from '@idl/mcp/idl-machine';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ReturnNotes,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for retrieving notes from IDL and ENVI.
 *
 * Independent of VS Code — works with any `IIDLExecutionBackend`.
 */
export async function ReturnNotes(
  backend: IIDLExecutionBackend,
  params: MCPToolParams<MCPTool_ReturnNotes>,
): Promise<MCPToolResponse<MCPTool_ReturnNotes>> {
  const started = await backend.start();
  if (!started.started) {
    return {
      success: false,
      result: {
        err: started?.reason || ' Failed to start',
      },
    };
  }

  if (!backend.verifyIDLVersion()) {
    return {
      success: false,
      result: { err: IDL_TRANSLATION.mcp.errors.badIDLVersion },
    };
  }

  return await backend.evaluateENVICommand<MCPTool_ReturnNotes>(
    `vscode_retrieveNotes`,
  );
}
