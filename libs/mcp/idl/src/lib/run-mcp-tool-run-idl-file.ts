import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import { IDL_TRANSLATION } from '@idl/translation';
import type {
  IIDLMCPExecutionBackend,
  MCPTool_RunIDLFile,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for executing an IDL file.
 *
 * Independent of VS Code — compiles and runs the file directly
 * through the backend without opening it in an editor or re-using our
 * run command
 */
export async function RunMCPTool_RunIDLFile(
  backend: IIDLMCPExecutionBackend,
  params: MCPToolParams<MCPTool_RunIDLFile>,
): Promise<MCPToolResponse<MCPTool_RunIDLFile>> {
  const started = await backend.start(false);

  if (!started.started) {
    return {
      success: false,
      result: { err: started?.reason || 'Failed to start' },
    };
  }

  // set compile option and make sure we are at the main level
  await backend.evaluate(`compile_opt idl2 & message, /reset & retall`);

  // reset main with ".run"
  await backend.resetMain();

  // reset syntax errors
  backend.resetErrorsByFile();

  // compile the file
  const compileOutput = await backend.evaluate(`.compile -v '${params.uri}'`, {
    silent: false,
    echo: true,
  });

  // get syntax errors
  const errs = backend.getErrorsByFile();

  // check for compile errors
  if (Object.keys(errs).length > 0) {
    return {
      success: false,
      result: {
        err: `Detected syntax errors in IDL file. Details: ${JSON.stringify(errs)}. Before retrying, use search-for-routine and get-routine-docs to verify any reported routine or API. Do not guess at a replacement and rerun.`,
      },
      idlOutput: compileOutput,
    };
  }

  // run the program
  const idlOutput = await backend.evaluate(`.go`, { echo: true });

  const lastMessage = CleanIDLOutput(
    await backend.evaluate(`help, /last_message`, { silent: true }),
  );

  switch (true) {
    case lastMessage !== '':
      return {
        success: false,
        idlOutput,
        result: {
          err: `An error message was reported:\n\n  ${lastMessage}. Before retrying, use search-for-routine and get-routine-docs to verify any reported routine or API. Do not guess at a replacement and rerun.`,
        },
      };

    case !backend.isAtMain():
      return {
        success: false,
        idlOutput,
        result: {
          err: `${IDL_TRANSLATION.debugger.commandErrors.idlStopped}. Before retrying, use search-for-routine and get-routine-docs to verify any reported routine or API. Do not guess at a replacement and rerun.`,
        },
      };

    default:
      return {
        success: true,
        result: 'Executed file, see idlOutput for more details',
        idlOutput,
      };
  }
}
