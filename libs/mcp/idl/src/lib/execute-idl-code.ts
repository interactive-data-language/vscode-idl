import { CreateRandomFilename, MCP_IDL_FOLDER } from '@idl/idl/files';
import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import { IIDLExecutionBackend } from '@idl/mcp/idl-machine';
import { IDL_TRANSLATION } from '@idl/translation';
import { COMPILE_FILE_ERROR } from '@idl/types/idl/idl-process';
import {
  MCPTool_ExecuteIDLCode,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { PrepareIDLCodeCallback } from './execute-idl-code.interface';

/**
 * Core logic for executing IDL code.
 *
 * Independent of VS Code — works with any `IIDLExecutionBackend`.
 *
 * @param backend       The IDL execution backend
 * @param params        Tool parameters (code to execute)
 * @param prepareCode   Callback to prepare/transform code before execution
 */
export async function ExecuteIDLCode(
  backend: IIDLExecutionBackend,
  params: MCPToolParams<MCPTool_ExecuteIDLCode>,
  prepareCode: PrepareIDLCodeCallback,
): Promise<MCPToolResponse<MCPTool_ExecuteIDLCode>> {
  const started = await backend.start(false);

  if (!started.started) {
    return { success: false, err: started.reason };
  }

  /** PRO file for where we write the code to disk */
  const fsPath = join(MCP_IDL_FOLDER, CreateRandomFilename('mcp_code', '.pro'));

  // make our folder if it doesnt exist
  if (!existsSync(MCP_IDL_FOLDER)) {
    mkdirSync(MCP_IDL_FOLDER, { recursive: true });
  }

  /** Prepare/transform the code */
  const resp = await prepareCode(params.code);

  if (!resp) {
    return {
      success: false,
      err: IDL_TRANSLATION.mcp.errors.failedCodePrepare,
    };
  }

  if (resp.emptyMain) {
    return {
      success: false,
      err: 'While not a problem, code was not run because we did not find a main level program to execute',
    };
  }

  // set compile option and make sure we are at the main level
  await backend.evaluate(`compile_opt idl2 & message, /reset & retall`);

  // reset main with ".run"
  await backend.resetMain();

  // write file
  writeFileSync(fsPath, resp.code);

  // reset syntax errors
  backend.resetErrorsByFile();

  // if batch, then disable quiet so that we can see compile output
  if (resp.isBatch) {
    await backend.evaluate('!quiet = 0');
  }

  // try to run and check for errors
  const firstOutput = await backend.evaluate(
    resp.isBatch ? `@'${fsPath}'` : `.compile -v '${fsPath}'`,
    {
      silent: false,
      echo: true,
    },
  );

  // get syntax errors
  const errsWithPrint = backend.getErrorsByFile();

  /**
   * If we didnt fail, but we have a batch file, then we
   * need to append the cell output
   */
  if (resp.isBatch) {
    return { success: true, idlOutput: firstOutput };
  }

  // reset quiet flag
  if (resp.isBatch) {
    await backend.evaluate(`!quiet = 1`);
  }

  // check for compile errors
  if (Object.keys(errsWithPrint).length > 0) {
    return {
      success: false,
      err: `Detected syntax errors in IDL code. Details: ${JSON.stringify(
        errsWithPrint,
      )}`,
    };
  }

  // check for batch file errors for files that dont exist
  if (resp.isBatch && COMPILE_FILE_ERROR.test(firstOutput)) {
    return {
      success: false,
      err: `Failed to execute code as IDL batch file using the "@" syntax. Please see IDL Console for more details.`,
    };
  }

  switch (true) {
    // dont do anything else if our batch file
    case resp.isBatch:
      break;
    // if main, execute
    case resp.hasMain: {
      const idlOutput = await backend.evaluate(`.go`, { echo: true });

      const lastMessage = CleanIDLOutput(
        await backend.evaluate(`help, /last_message`, {
          silent: true,
        }),
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
            err: `The IDL process ran, but likely stopped somewhere, meaning that the code did not finish executing and may have runtime errors that need to be fixed.`,
          };

        default:
          return {
            success: true,
            idlOutput,
          };
      }
    }
    default:
      break;
  }

  return { success: started.started, err: started.reason };
}
