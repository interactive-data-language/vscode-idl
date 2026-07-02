import { RegisterENVINotifyHandlers } from '@idl/mcp/envi';
import { ENVIMCPToolResponse } from '@idl/types/mcp';

import { IDLDebugAdapter } from '../idl-debug-adapter.class';

/** Track the last message we got from IDL */
export let LAST_ENVI_MCP_MESSAGE: ENVIMCPToolResponse;

/**
 * Handles CLI progress notifications from the IDL Machine
 */
export function RegisterDebugAdapterENVISuccessMessageHandler(
  adapter: IDLDebugAdapter,
) {
  // plug in progress messages
  if (adapter._runtime.isIDLMachine()) {
    RegisterENVINotifyHandlers(adapter._runtime, (msg) => {
      LAST_ENVI_MCP_MESSAGE = msg;
    });
  }
}
