import { MCPResourceIndex } from '@idl/mcp/server-resources';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { MCPToolRegistry } from '../mcp-tool-registry.class';

/**
 * List all resources
 */
export function RegisterMCPTool_ListAllResources(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.LIST_ALL_RESOURCES,
    IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.GET_RESOURCE],
    `Returns a list of the names of all resources available. This tool provides an alternate way to return resources instead of searching with "${MCP_TOOL_LOOKUP.SEARCH_RESOURCES}". Do not use this to list ENVI's available tools, use the tool "${MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS}" instead. Pass IDs for content you want to retrieve to the tool "${MCP_TOOL_LOOKUP.GET_RESOURCE}" to fetch the resource.`,
    {},
    async (id) => {
      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: JSON.stringify(MCPResourceIndex.list()),
          },
        ],
      };
    }
  );
}
