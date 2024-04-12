import { CleanPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { GetActivePROCodeWindow, GetDocumentOutline } from '@idl/vscode/shared';
import { OutputEvent } from '@vscode/debugadapter';

import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';
import { VerifyIDLHasStarted } from './start-idl';

/**
 * Compile current pro file and runs
 */
export async function RunFile(): Promise<boolean> {
  // return if IDL hasnt started yet
  if (!VerifyIDLHasStarted(true)) {
    return false;
  }

  // get code and make sure it is ready for use
  const code = GetActivePROCodeWindow(true);
  if (!code) {
    return false;
  }
  await code.save();

  // get the path for the file
  const uri = CleanPath(code.uri.fsPath);

  // compile our file
  await IDL_DEBUG_ADAPTER.evaluate(`.compile -v '${uri}'`, {
    echo: true,
    errorCheck: true,
  });

  /**
   * Get syntax errors and check if we have them
   */
  const errors = IDL_DEBUG_ADAPTER.getSyntaxProblems();
  if (uri in errors) {
    if (errors[uri].length > 0) {
      IDL_DEBUG_ADAPTER.sendEvent(
        new OutputEvent(
          `${IDL_TRANSLATION.debugger.adapter.syntaxErrorsFound}\n`,
          'stderr'
        )
      );
      return false;
    }
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
      return false;

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
  await IDL_DEBUG_ADAPTER.evaluate(command, {
    echo: true,
    newLine: true,
    errorCheck: true,
  });

  return true;
}
