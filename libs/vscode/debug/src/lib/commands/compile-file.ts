import { CleanPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { GetActivePROCodeWindow } from '@idl/vscode/shared';
import { OutputEvent } from '@vscode/debugadapter';

import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';
import { VerifyIDLHasStarted } from './start-idl';

/**
 * Compile current pro file
 */
export async function CompileFile(): Promise<boolean> {
  // return if IDL hasnt started
  if (!VerifyIDLHasStarted(true)) {
    return false;
  }

  // get code and make sure it is ready for use
  const code = GetActivePROCodeWindow(true);

  // return if no PRO code
  if (!code) {
    return false;
  }

  // save file
  await code.save();

  /** Get the URI for our file */
  const uri = code.uri.toString();

  // compile
  await IDL_DEBUG_ADAPTER.evaluate(
    `.compile -v '${CleanPath(code.uri.fsPath)}'`,
    { echo: true, newLine: true, errorCheck: true }
  );

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

  return true;
}
