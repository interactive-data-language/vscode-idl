import { IDL_TRANSLATION } from '@idl/translation';

import { IDL_DEBUG_ADAPTER } from '../initialize-debugger';
import { VerifyIDLHasStarted } from './start-idl';

/**
 * Executes current file as batch file
 */
export async function StartProfiling() {
  if (VerifyIDLHasStarted(true)) {
    return await IDL_DEBUG_ADAPTER.evaluate(`vscode_startProfiling`, {
      echo: true,
      echoThis: IDL_TRANSLATION.debugger.idl.startProfiling,
      silent: true,
      idlInfo: false,
    });
  }
}

/**
 * Executes current file as batch file
 */
export async function StopProfiling() {
  if (VerifyIDLHasStarted(true)) {
    return await IDL_DEBUG_ADAPTER.evaluate(`vscode_stopProfiling`, {
      echo: true,
      echoThis: IDL_TRANSLATION.debugger.idl.stopProfiling,
      silent: true,
      idlInfo: false,
    });
  }
}
