import { MCPResourceIndex } from '@idl/mcp/server-resources';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { MCPToolHelper } from '../mcp-tool-helper.class';

/**
 * Get a prompt from the server
 */
export function RegisterMCPTool_GetPrompt(helper: MCPToolHelper) {
  helper.registerTool(
    MCP_TOOL_LOOKUP.GET_PROMPT,
    {
      title: IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.GET_PROMPT],
      description: `Returns the content for a prompt (instruction set or tutorial) based on the name. The name should come from "${MCP_TOOL_LOOKUP.LIST_PROMPTS}".`,
      inputSchema: {
        names: z
          .array(z.string())
          .describe('The names of the prompts to fetch'),
      },
    },
    async (id, { names }) => {
      /** Init results by names of sources */
      const results: { [key: string]: string } = {};

      // retrieve all
      for (let i = 0; i < names.length; i++) {
        // make sure we have requested ID
        if (!MCPResourceIndex.has(names[i])) {
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: `No matching prompt of name "${names[i]}", did the name come from the tool "${MCP_TOOL_LOOKUP.LIST_PROMPTS}"?`,
              },
            ],
          };
        }

        // save by name
        results[names[i]] = MCPResourceIndex.get(names[i]);
      }

      return {
        isError: false,
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
