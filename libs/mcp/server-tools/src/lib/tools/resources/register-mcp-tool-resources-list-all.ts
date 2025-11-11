import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { RESOURCE_DESCRIPTIONS } from '../../helpers/track-server-resource';
import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/**
 * List all resources
 */
export function RegisterMCPTool_ResourcesListAll(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.tool(
    MCP_TOOL_LOOKUP.RESOURCES_LIST_ALL,
    `Lists all resources to provide additional context for IDL and ENVI. For ENVI's capabilities (tools/tasks) use the ${MCP_TOOL_LOOKUP.ENVI_LIST_TASKS} tool as a starting poiny. Start here for any questions about IDL before searching the internet. Resources cover a broad array of topics, including code snippets, information about the extension, and best practices. Returns an object where the key is the name of the resource and the value is a description of the resource. Then use the tool ${MCP_TOOL_LOOKUP.RESOURCES_GET_RESOURCE} to fetch the resource by name.`,
    {},
    async (id) => {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(RESOURCE_DESCRIPTIONS),
          },
        ],
      };
    }
  );
}
