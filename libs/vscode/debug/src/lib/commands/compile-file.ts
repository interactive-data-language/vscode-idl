import { CleanPath } from '@idl/shared';
import { GetActivePROCodeWindow } from '@idl/vscode/shared';

import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';
import { VerifyIDLHasStarted } from './start-idl';

/**
 * Compile current pro file
 */
export async function CompileFile() {
  if (VerifyIDLHasStarted(true)) {
    // get code and make sure it is ready for use
    const code = GetActivePROCodeWindow(true);
    if (!code) {
      return;
    }
    await code.save();
    return await IDL_DEBUG_ADAPTER.evaluate(
      `.compile -v '${CleanPath(code.uri.fsPath)}'`,
      { echo: true }
    );
  }
}
