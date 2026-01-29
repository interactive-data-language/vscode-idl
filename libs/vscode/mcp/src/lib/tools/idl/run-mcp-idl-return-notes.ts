import {
  MCPTool_ReturnNotes,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { StartIDL } from '@idl/vscode/debug';

import { MCPEvaluateENVICommand } from '../../helpers/mcp-evaluate-envi-command';
import { MCPVerifyIDLVersion } from '../../helpers/mcp-verify-idl-version';

/**
 * Start IDL
 */
export async function RunMCP_IDLReturnNotes(
  id: string,
  params: MCPToolParams<MCPTool_ReturnNotes>
): Promise<MCPToolResponse<MCPTool_ReturnNotes>> {
  /**
   * Start IDL
   */
  const started = await StartIDL();

  // return if unable to start IDL
  if (!started.started) {
    return {
      success: false,
      err: started.reason,
      notes: { envi: {}, idl: {} },
    };
  }

  // verify version
  if (!MCPVerifyIDLVersion()) {
    return {
      success: false,
      err: 'Requires at least IDL 9.2 to function',
      notes: { envi: {}, idl: {} },
    };
  }

  // start ENVI/make sure it is started
  const notes = await MCPEvaluateENVICommand(`vscode_retrieveNotes`);

  // if we didnt succeed, then return
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
