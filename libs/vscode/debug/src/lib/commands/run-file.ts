import { IDL_TRANSLATION } from '@idl/translation';
import { IRunIDLCommandResult } from '@idl/types/vscode-debug';
import { GetActivePROCodeWindow, GetDocumentOutline } from '@idl/vscode/shared';
import { OutputEvent } from '@vscode/debugadapter';

import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';
import { CompileFile } from './compile-file';

/**
 * Compile current pro file and runs
 */
export async function RunFile(): Promise<IRunIDLCommandResult> {
  /** Compile file */
  const compile = await CompileFile();

  // return if we didnt compile successfully
  if (!compile.success) {
    return compile;
  }

  /** Get the current PRO code */
  const code = GetActivePROCodeWindow();

  // sanity check
  if (!code) {
    return {
      success: false,
      err: IDL_TRANSLATION.debugger.commandErrors.noProFile,
    };
  }

  /**
   * Get outline from extension
   */
  const outline = await GetDocumentOutline(code);

  /**
   * Get the bottom-most routine
   */
  const bottom = outline[outline.length - 1];

  /** Name of item on the bottom of our outline */
  const bottomName = bottom.name.toLowerCase();

  /** Command to execute */
  let command = '.go';

  /**
   * Determine how to proceed
   */
  switch (true) {
    /**
     * Methods
     */
    case bottomName.includes('::'):
      IDL_DEBUG_ADAPTER.sendEvent(
        new OutputEvent(
          `${IDL_TRANSLATION.debugger.adapter.noRoutineFound}\n`,
          'stderr'
        )
      );
      return {
        success: false,
        err: IDL_TRANSLATION.debugger.adapter.noRoutineFound,
      };

    /**
     * Main level program
     */
    case bottomName === '$main$':
      command = '.go';
      break;

    /**
     * Function
     */
    case bottomName.endsWith('()'):
      command = `void = ${bottom.name}`;
      break;

    /**
     * Procedure
     */
    default:
      command = bottom.name;
      break;
  }

  // execute our command
  const idlOutput = await IDL_DEBUG_ADAPTER.evaluate(command, {
    echo: true,
    newLine: true,
    errorCheck: true,
  });

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
      err: IDL_TRANSLATION.debugger.commandErrors.idlStopped,
    };
  }
}
