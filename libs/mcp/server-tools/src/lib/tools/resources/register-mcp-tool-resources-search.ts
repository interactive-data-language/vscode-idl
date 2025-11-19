import { MCPResourceIndex } from '@idl/mcp/server-resources';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/**
 * Search through registered resources
 */
export function RegisterMCPTool_ResourcesSearchResources(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.RESOURCES_SEARCH_RESOURCES,
    IDL_TRANSLATION.mcp.tools.displayNames[
      MCP_TOOL_LOOKUP.RESOURCES_SEARCH_RESOURCES
    ],
    `Searches known resources about IDL and ENVI and returns the top results.  Content comes from the official ENVI and IDL documentation.`,
    {
      query: z
        .string()
        .describe(
          'The query to search for, should be no more than 3 words as the search uses a fuzzy-style search'
        ),
    },
    async (id, { query }) => {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(MCPResourceIndex.search(query)),
          },
        ],
      };
    }
  );
}
