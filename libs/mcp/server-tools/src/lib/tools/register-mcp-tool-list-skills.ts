import { MCPServer } from '@idl/mcp/server';
import { MCPSkillRegistry } from '@idl/mcp/skills';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

/**
 * List registered skills
 */
export function RegisterMCPTool_ListSkills(
  server: MCPServer,
  registry: MCPSkillRegistry,
) {
  server.registerTool(
    MCP_TOOL_LOOKUP.LIST_SKILLS,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.LIST_SKILLS],
      description:
        'Returns a list of available skills. Skills contain specialized instructions, best practices, and workflow guidance. Use this before starting complex tasks with ENVI and IDL to check if relevant guidance exists.',
      inputSchema: {},
    },
    async (id) => {
      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: JSON.stringify(registry.skillDescriptions()),
          },
        ],
      };
    },
  );
}
