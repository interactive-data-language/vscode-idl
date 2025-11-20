import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { RESOURCE_DESCRIPTIONS } from '../../helpers/track-server-resource';
import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/**
 * List all resources
 *
 * @deprecated
 */
export function RegisterMCPTool_ResourcesListAll(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.RESOURCES_LIST_ALL,
    IDL_TRANSLATION.mcp.tools.displayNames[
      MCP_TOOL_LOOKUP.RESOURCES_GET_RESOURCE
    ],
    `Lists all resources to provide additional context for IDL and ENVI. Do not use this to list ENVI's available tools, use the tool "${MCP_TOOL_LOOKUP.ENVI_LIST_TASKS}" instead. Start here for any questions about IDL before searching the internet. Resources cover a broad array of topics, including code snippets, information about the extension, and best practices. Returns an object where the key is the name of the resource and the value is a description of the resource. Then use the tool ${MCP_TOOL_LOOKUP.RESOURCES_GET_RESOURCE} to fetch the resource by name.`,
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
