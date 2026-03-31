import { MCPPromptRegistry } from '@idl/mcp/prompts';
import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

/**
 * Get a prompt from the server
 */
export function RegisterMCPTool_GetPrompt(
  server: MCPServer,
  registry: MCPPromptRegistry,
) {
  server.registerTool(
    MCP_TOOL_LOOKUP.GET_PROMPT,
    {
      title: IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.GET_PROMPT],
      description: `Returns the content of a prompt based on the name. The name should come from "${MCP_TOOL_LOOKUP.LIST_PROMPTS}".`,
      inputSchema: {
        name: z.string().describe('The name of the prompts to fetch'),
      },
    },
    async (id, { name }) => {
      // check for invalid ID
      if (!registry.hasPrompt(name)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Unknown prompt name of "${name}"`,
            },
          ],
        };
      }

      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: registry.getPrompt(name),
          },
        ],
      };
    },
  );
}
