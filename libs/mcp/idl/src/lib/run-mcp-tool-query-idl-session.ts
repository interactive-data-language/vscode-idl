import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import {
  IIDLMCPExecutionBackend,
  MCPTool_QueryIDLSession,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for querying the IDL session.
 *
 * Runs the command in the same IDL session with `silent: true`
 * so that output is captured and returned but never echoed to
 * the user's debug console.
 */
export async function RunMCPTool_QueryIDLSession(
  backend: IIDLMCPExecutionBackend,
  params: MCPToolParams<MCPTool_QueryIDLSession>,
): Promise<MCPToolResponse<MCPTool_QueryIDLSession>> {
  const started = await backend.start();

  if (!started.started) {
    return { success: false, result: { err: started.reason || '' } };
  }

  try {
    const idlOutput = CleanIDLOutput(
      await backend.evaluate(params.command, { silent: true }),
    );

    return { success: true, result: '', idlOutput };
  } catch (err) {
    return {
      success: false,
      result: {
        err: `Error evaluating IDL command: ${err instanceof Error ? err.message : String(err)}`,
      },
    };
  }
}
