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
        adapter.sendEvent(new OutputEvent(`${msg.param1}\n`, 'console'));
        return 1;
      }
    );
  }
}
