import { CreateRandomFilename, MCP_IDL_FOLDER } from '@idl/idl/files';
import { IDL_MCP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { COMPILE_FILE_ERROR } from '@idl/types/idl/idl-process';
import {
  MCPTool_ExecuteIDLCode,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSENGER } from '@idl/vscode/client';
import { IDL_DEBUG_ADAPTER, StartIDL } from '@idl/vscode/debug';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Open a dataset in ENVI
 */
export async function RunMCPExecuteIDLCode(
  params: MCPToolParams<MCPTool_ExecuteIDLCode>
): Promise<MCPToolResponse<MCPTool_ExecuteIDLCode>> {
  /**
   * Start IDL
   */
  const started = await StartIDL();

  // return if unable to start IDL
  if (!started.started) {
    return { success: false, err: started.reason };
  }

  /**
   * PRO file for where we write the NB cell to disk
   */
  const fsPath = join(MCP_IDL_FOLDER, CreateRandomFilename('mcp_code', '.pro'));

  // make our folder if it doesnt exist
  if (!existsSync(MCP_IDL_FOLDER)) {
    mkdirSync(MCP_IDL_FOLDER, { recursive: true });
  }

  /**
   * Send message to convert code
   */
  const resp = await LANGUAGE_SERVER_MESSENGER.sendRequest(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.PREPARE_IDL_CODE,
    {
      code: params.code,
    }
  );

  // see if theres a problem, user should be alerted
  if (!resp) {
    IDL_LOGGER.log({
      type: 'error',
      log: IDL_MCP_LOG,
      content: [IDL_TRANSLATION.notebooks.errors.failedCodePrepare],
      alert: IDL_TRANSLATION.mcp.errors.failedCodePrepare,
    });

    return {
      success: false,
      err: IDL_TRANSLATION.mcp.errors.failedCodePrepare,
    };
  }

  // check if empty main level
  if (resp.emptyMain) {
    return {
      success: false,
      err: 'While not a problem, code was not run because we did not find a main level program to execute',
    };
  }

  IDL_LOGGER.log({
    type: 'debug',
    log: IDL_MCP_LOG,
    content: ['Prepared code', resp.code.split(/\r*\n/gim)],
  });

  // set compile option and make sure we are at the main level
  await IDL_DEBUG_ADAPTER.evaluate(`compile_opt idl2 & retall`);

  // write file
  writeFileSync(fsPath, resp.code);

  // reset syntax errors
  IDL_DEBUG_ADAPTER._runtime.resetErrorsByFile();

  // if batch, then disable quiet so that we can see compile output
  if (resp.isBatch) {
    await IDL_DEBUG_ADAPTER.evaluate('!quiet = 0');
  }

  // try to run and check for errors
  const firstOutput = await IDL_DEBUG_ADAPTER.evaluate(
    resp.isBatch ? `@'${fsPath}'` : `.compile -v '${fsPath}'`,
    {
      silent: false,
      echo: true,
    }
  );

  // get syntax errors
  const errsWithPrint = IDL_DEBUG_ADAPTER._runtime.getErrorsByFile();

  // delete file - dont do this since we can keep it around
  // rmSync(fsPath);

  /**
   * If we didnt fail, but we have a batch file, then we
   * need to append the cell output
   *
   * This is because, for normal cells, we compile then check for
   * errors then run,
   *
   * Batch files just "run" and we check for errors in the output
   */
  if (resp.isBatch) {
    return { success: true, idlOutput: firstOutput };
  }

  // reset quiet flag
  if (resp.isBatch) {
    await IDL_DEBUG_ADAPTER.evaluate(`!quiet = 1`);
  }

  // check for compile errors
  if (Object.keys(errsWithPrint).length > 0) {
    return {
      success: false,
      err: `Detected syntax errors in IDL code. Details: ${JSON.stringify(
        errsWithPrint
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
      /**
       * Run and get IDL's output
       */
      const idlOutput = await IDL_DEBUG_ADAPTER.evaluate(`.go`, { echo: true });

      /**
       * Check if we ran successfully or not
       */
      if (IDL_DEBUG_ADAPTER.isAtMain()) {
        return {
          success: true,
          idlOutput,
        };
      } else {
        return {
          success: false,
          idlOutput,
          err: `The IDL process ran, but likely stopped somewhere, meaning that the code did not finish executing and may have runtime errors that need to be fixed.`,
        };
      }
    }
    default:
      break;
  }

  return { success: started.started, err: started.reason };
}
