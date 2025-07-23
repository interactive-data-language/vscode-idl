import { ICLIProgressNotification } from '@idl/types/idl/idl-machine';
import { OutputEvent } from '@vscode/debugadapter';

import { IDLDebugAdapter } from '../idl-debug-adapter.class';

/**
 * Handles CLI progress notifications from the IDL Machine
 */
export function RegisterDebugAdapterCLIProgressHandler(
  adapter: IDLDebugAdapter
) {
  // plug in progress messages
  if (adapter._runtime.isIDLMachine()) {
    adapter._runtime.registerIDLNotifyHandler(
      'cli_progressNotification',
      async (msg) => {
        /** Parse the message */
        const parsed: ICLIProgressNotification = JSON.parse(msg.param1);

        // send to console
        adapter.sendEvent(new OutputEvent(`${parsed.string}\n`, 'console'));

        // emit that we have finished
        return 1;
      }
    );
  }
}
