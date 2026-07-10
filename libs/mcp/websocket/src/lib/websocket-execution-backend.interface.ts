import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

/**
 * Set of MCP tool names that route through the WebSocket bridge when the
 * server is running in WebSocket mode. Anything not in this set is rejected
 * with an error so the model gets a clear "not available" signal.
 */
export const WEBSOCKET_TOOL_NAMES: ReadonlySet<string> = new Set<string>([
  MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS,
  MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI,
  MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI,
  MCP_TOOL_LOOKUP.RETURN_NOTES,
  MCP_TOOL_LOOKUP.RUN_ENVI_TOOL,
  MCP_TOOL_LOOKUP.TAKE_ENVI_SCREENSHOT,
]);
