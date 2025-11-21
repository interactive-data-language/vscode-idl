import { MCPResourceIndex } from '@idl/mcp/server-resources';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/**
 * Get a resource from the server
 */
export function RegisterMCPTool_ResourcesGetResource(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.RESOURCES_GET_RESOURCE,
    IDL_TRANSLATION.mcp.tools.displayNames[
      MCP_TOOL_LOOKUP.RESOURCES_GET_RESOURCE
    ],
    `Returns the content for a resource based on the name. The name should come from "${MCP_TOOL_LOOKUP.RESOURCES_LIST_ALL}".`,
    {
      names: z.array(z.string()).describe('The names of the resource to fetch'),
    },
    async (id, { names }) => {
      /** Init results by names of sources */
      const results: { [key: string]: string } = {};

      // retrieve all
      for (let i = 0; i < names.length; i++) {
        results[names[i]] = MCPResourceIndex.get(names[i]);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results),
          },
        ],
      };
    }
  );
}
