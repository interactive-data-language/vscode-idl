import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

/**
 * MCP tools exposed to the model when the server is running in WebSocket
 * bridge mode. Execution for these tools is forwarded to the connected WS
 * client instead of running against a local IDL Machine process.
 *
 * Kept as a single source of truth so both the WebSocket execution handler
 * `switch` and the Copilot chat `mcpServers.tools` allowlist stay in sync.
 */
export const WEBSOCKET_ENABLED_MCP_TOOLS: readonly string[] = [
  MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS,
  MCP_TOOL_LOOKUP.GET_ENVI_TOOL_WORKFLOW,
  MCP_TOOL_LOOKUP.GET_PROMPT,
  MCP_TOOL_LOOKUP.GET_RESOURCE,
  MCP_TOOL_LOOKUP.LIST_ALL_RESOURCES,
  MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS,
  MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS,
  MCP_TOOL_LOOKUP.LIST_PROMPTS,
  MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI,
  MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI,
  /**
   * This needs fixing since it is a call into IDL and
   * not an MCP tool
   */
  MCP_TOOL_LOOKUP.RETURN_NOTES,
  MCP_TOOL_LOOKUP.RUN_ENVI_TOOL,
  MCP_TOOL_LOOKUP.SAVE_ENVI_TOOL_WORKFLOW,
  MCP_TOOL_LOOKUP.SEARCH_FOR_FILES,
  MCP_TOOL_LOOKUP.SEARCH_RESOURCES,
  MCP_TOOL_LOOKUP.TAKE_ENVI_SCREENSHOT,
];
