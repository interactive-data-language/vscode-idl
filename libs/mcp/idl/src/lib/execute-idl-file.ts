import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import { IIDLExecutionBackend } from '@idl/mcp/idl-machine';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ExecuteIDLFile,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for executing an IDL file.
 *
 * Independent of VS Code — compiles and runs the file directly
 * through the backend without opening it in an editor.
 */
export async function ExecuteIDLFile(
  backend: IIDLExecutionBackend,
  params: MCPToolParams<MCPTool_ExecuteIDLFile>,
): Promise<MCPToolResponse<MCPTool_ExecuteIDLFile>> {
  const started = await backend.start(false);

  if (!started.started) {
    return { success: false, err: started.reason };
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
      err: `Detected syntax errors in IDL file. Details: ${JSON.stringify(errs)}`,
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
        err: `An error message was reported:\n\n  ${lastMessage}`,
      };

    case !backend.isAtMain():
      return {
        success: false,
        idlOutput,
        err: IDL_TRANSLATION.debugger.commandErrors.idlStopped,
      };

    default:
      return {
        success: true,
        idlOutput,
      };
  }
}
