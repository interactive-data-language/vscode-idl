import {
  IIDLMCPExecutionBackend,
  MCPTool_InspectIDLState,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/** Core logic for inspecting IDL session state */
export async function RunMCPTool_InspectIDLState(
  backend: IIDLMCPExecutionBackend,
  params: MCPToolParams<MCPTool_InspectIDLState>,
): Promise<MCPToolResponse<MCPTool_InspectIDLState>> {
  if (!backend.isStarted()) {
    return {
      success: false,
      result: { err: 'IDL is not running. Start an IDL session first.' },
    };
  }

  switch (params.action) {
    case 'get-coverage': {
      if (!params.file) {
        return {
          success: false,
          result: { err: 'get-coverage requires a "file" parameter.' },
        };
      }
      return {
        success: true,
        result: await backend.getCodeCoverage(params.file),
      };
    }

    case 'get-errors':
      return { success: true, result: backend.getErrorsByFile() };

    case 'get-info':
      return { success: true, result: backend.getIDLInfo() };

    case 'get-output':
      return { success: true, result: backend.getCapturedOutput() };

    case 'get-stack':
      return { success: true, result: await backend.getTraceback() };

    case 'get-variables': {
      const frameId = params.frameId ?? 0;
      // only frameId=0 is safe during a debugger stop; other frames call evaluate() and clear the VS Code variables panel
      if (frameId !== 0) {
        return {
          success: false,
          result: {
            err: 'get-variables only supports frameId=0 while the debugger is paused. Use get-info to see all variables at the current frame.',
          },
        };
      }
      return { success: true, result: await backend.getVariables(frameId) };
    }

    default:
      return {
        success: false,
        result: { err: `Unknown action: "${(params as any).action}"` },
      };
  }
}
