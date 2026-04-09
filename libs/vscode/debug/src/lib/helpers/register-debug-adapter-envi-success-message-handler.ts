import { IENVISuccess } from '@idl/types/vscode-debug';

import { IDLDebugAdapter } from '../idl-debug-adapter.class';
import { PopulateENVIError } from './populate-envi-error';

/** Track the last message we got from IDL */
export let LAST_ENVI_SUCCESS_MESSAGE: IENVISuccess;

/**
 * Handles CLI progress notifications from the IDL Machine
 */
export function RegisterDebugAdapterENVISuccessMessageHandler(
  adapter: IDLDebugAdapter,
) {
  // plug in progress messages
  if (adapter._runtime.isIDLMachine()) {
    adapter._runtime.registerIDLNotifyHandler('envi_success', async (msg) => {
      /** Parse the message */
      LAST_ENVI_SUCCESS_MESSAGE = JSON.parse(msg.param1);

      // populate error message
      PopulateENVIError(LAST_ENVI_SUCCESS_MESSAGE);

      // emit that we have finished
      return 1;
    });

    adapter._runtime.registerIDLNotifyHandler('envi_failure', async (msg) => {
      /** Parse the message */
      LAST_ENVI_SUCCESS_MESSAGE = JSON.parse(msg.param1);

      // populate error message
      PopulateENVIError(LAST_ENVI_SUCCESS_MESSAGE);

      // emit that we have finished
      return 1;
    });
  }
}
