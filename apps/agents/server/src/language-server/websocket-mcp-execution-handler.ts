import { MCP_TOOL_LOOKUP, MCPSendRequestCallback } from '@idl/types/mcp';

import { WebSocketToolBridge } from '../websocket/websocket-tool-bridge.class';

/**
 * Set of MCP tool names that route through the WebSocket bridge when the
 * server is running in WebSocket mode. Anything not in this set is rejected
 * with an error so the model gets a clear "not available" signal.
 */
const WEBSOCKET_TOOL_NAMES: ReadonlySet<string> = new Set<string>([
  MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS,
  MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI,
  MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI,
  MCP_TOOL_LOOKUP.RETURN_NOTES,
  MCP_TOOL_LOOKUP.RUN_ENVI_TOOL,
  MCP_TOOL_LOOKUP.TAKE_ENVI_SCREENSHOT,
]);

/**
 * Creates an `MCPSendRequestCallback` that forwards execution of the allowed
 * ENVI tools over the provided WebSocket bridge and rejects every other tool
 * with a "not available in websocket mode" error.
 *
 * Used in place of `AgentsServerMCPExecutionHandler` when the server is
 * launched with `WEBSOCKET_ENABLED=true` — no local IDL Machine backend is
 * available in that mode.
 */
export function WebSocketMCPExecutionHandler(
  bridge: WebSocketToolBridge,
): MCPSendRequestCallback {
  const callback: MCPSendRequestCallback = async (
    _executionId,
    tool,
    params,
  ) => {
    if (!WEBSOCKET_TOOL_NAMES.has(tool)) {
      return {
        success: false,
        err: `Tool not available in websocket mode: ${tool}`,
      } as any;
    }

    try {
      return await bridge.sendRequest(tool, params);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : String(err ?? 'unknown error');
      return { success: false, result: { err: message } };
    }
  };

  return callback;
}
