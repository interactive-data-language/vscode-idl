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
      err: started.reason,
      notes: { envi: {}, idl: {} },
    };
  }

  if (!backend.verifyIDLVersion()) {
    return {
      success: false,
      err: IDL_TRANSLATION.mcp.errors.badIDLVersion,
      notes: { envi: {}, idl: {} },
    };
  }

  const notes = await backend.evaluateENVICommand(`vscode_retrieveNotes`);

  if (!notes.succeeded) {
    return {
      success: notes.succeeded,
      err: notes.error,
      notes: { envi: {}, idl: {} },
      idlOutput: notes.idlOutput,
    };
  }

  return {
    success: started.started,
    err: started.reason,
    notes: notes.payload as any,
  };
}
