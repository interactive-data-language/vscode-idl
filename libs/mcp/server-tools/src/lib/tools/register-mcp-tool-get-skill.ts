import { MCPServer } from '@idl/mcp/server';
import { MCPSkillRegistry } from '@idl/mcp/skills';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

/**
 * Get a skill from the server
 */
export function RegisterMCPTool_GetSkill(
  server: MCPServer,
  registry: MCPSkillRegistry,
) {
  server.registerTool(
    MCP_TOOL_LOOKUP.GET_SKILL,
    {
      title: IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.GET_SKILL],
      description: `Returns the content of a skill based on the name. The name should come from "${MCP_TOOL_LOOKUP.LIST_SKILLS}".`,
      inputSchema: {
        name: z.string().describe('The name of the skill to fetch'),
      },
    },
    async (id, { name }) => {
      // check for invalid ID
      if (!registry.hasSkill(name)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Unknown skill name of "${name}"`,
            },
          ],
        };
      }

      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: registry.getSkill(name),
          },
        ],
      };
    },
  );
}
