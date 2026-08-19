import {
  IIDLMCPExecutionBackend,
  MCPTool_ControlIDLDebugger,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

// Executes a stepping command and returns the current debug location.
async function StepAndGetLocation(
  backend: IIDLMCPExecutionBackend,
  step: () => Promise<void>,
): Promise<MCPToolResponse<MCPTool_ControlIDLDebugger>> {
  await step();

  const stack = await backend.getTraceback();

  return {
    success: true,
    result: stack || 'Execution finished.',
  };
}

/**
 * Handles the control-idl-debugger MCP tool in the VS Code extension.
 *
 * The goal is to allow for breakpoint management from the IDL-Agent.
 *
 * Because this is dependent on the VS Code debug adapter it will only work in
 * the VS Code extension.
 */
export async function RunMCPTool_ControlIDLDebugger(
  backend: IIDLMCPExecutionBackend,
  params: MCPToolParams<MCPTool_ControlIDLDebugger>,
): Promise<MCPToolResponse<MCPTool_ControlIDLDebugger>> {
  // IDL must be running.
  if (!backend.isStarted()) {
    return {
      success: false,
      result: { err: 'IDL is not running. Start an IDL session first.' },
    };
  }

  switch (params.action) {
    case 'clear-all-breakpoints': {
      await backend.clearBreakpoint();

      return {
        success: true,
        result: 'All breakpoints cleared.',
      };
    }

    case 'clear-breakpoint': {
      if (!params.file || params.line === undefined) {
        return {
          success: false,
          result: {
            err: 'clear-breakpoint requires both "file" and "line" parameters.',
          },
        };
      }

      await backend.clearBreakpoint(params.file, params.line);

      return {
        success: true,
        result: `Breakpoint cleared at ${params.file}:${params.line}`,
      };
    }

    case 'continue':
      return StepAndGetLocation(backend, () => backend.debugContinue());

    case 'list-breakpoints': {
      const output = await backend.listBreakpoints();

      return {
        success: true,
        result: output.length > 0 ? output : 'No breakpoints set.',
      };
    }

    case 'set-breakpoint': {
      if (!params.file || params.line === undefined) {
        return {
          success: false,
          result: {
            err: 'set-breakpoint requires both "file" and "line" parameters.',
          },
        };
      }

      await backend.setBreakpoint(params.file, params.line);

      return {
        success: true,
        result: `Breakpoint set at ${params.file}:${params.line}`,
      };
    }

    case 'step-in':
      return StepAndGetLocation(backend, () => backend.debugStepIn());

    case 'step-out':
      return StepAndGetLocation(backend, () => backend.debugStepOut());

    case 'step-over':
      return StepAndGetLocation(backend, () => backend.debugStepOver());

    default:
      return {
        success: false,
        result: { err: `Unknown action: "${(params as any).action}"` },
      };
  }
}
