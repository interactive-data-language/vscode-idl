import { PopulateENVIError, RegisterENVINotifyHandlers } from '@idl/mcp/envi';
import { IENVISuccess } from '@idl/types/vscode-debug';

import { IDLDebugAdapter } from '../idl-debug-adapter.class';

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
    RegisterENVINotifyHandlers(adapter._runtime, (msg) => {
      LAST_ENVI_SUCCESS_MESSAGE = msg;
    });
  }
}
