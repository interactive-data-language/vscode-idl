import { CleanPath } from '@idl/shared';
import { GetActivePROCodeWindow } from '@idl/vscode/shared';

import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';
import { VerifyIDLHasStarted } from './start-idl';

/**
 * Executes current file as batch file
 */
export async function ExecuteFile() {
  if (VerifyIDLHasStarted(true)) {
    // get code and make sure it is ready for use
    const code = GetActivePROCodeWindow(true);
    if (!code) {
      return;
    }
    await code.save();

    return await IDL_DEBUG_ADAPTER.evaluate(
      `@'${CleanPath(code.uri.fsPath)}'`,
      {
        continued: true,
        echo: true,
      }
    );
  }
}
