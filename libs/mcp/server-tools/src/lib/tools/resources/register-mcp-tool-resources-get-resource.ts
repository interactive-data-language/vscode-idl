import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { RESOURCE_CONTENT } from '../../helpers/track-server-resource';
import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/**
 * Get a resource from the server
 */
export function RegisterMCPTool_ResourcesGetResource(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.tool(
    MCP_TOOL_LOOKUP.RESOURCES_GET_RESOURCE,
    `Returns the value of a resource based on the name. The name should come from ${MCP_TOOL_LOOKUP.RESOURCES_LIST_ALL}.`,
    {
      name: z.string().describe('The name of the resource to fetch'),
    },
    async (id, { name }) => {
      /**
       * Attempt to load the content
       */
      const content =
        name in RESOURCE_CONTENT
          ? RESOURCE_CONTENT[name]
          : `No known resource by name "${name}"`;

      return {
        content: [
          {
            type: 'text',
            text: content,
          },
        ],
      };
    }
  );
}
