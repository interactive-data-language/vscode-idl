import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';
import { VerifyIDLHasStarted } from './start-idl';

/**
 * Executes current file as batch file
 */
export async function ResetIDL() {
  if (VerifyIDLHasStarted(true)) {
    return await IDL_DEBUG_ADAPTER.evaluate(`.reset`, {
      continued: true,
      echo: true,
      newLine: true,
    });
  }
}
