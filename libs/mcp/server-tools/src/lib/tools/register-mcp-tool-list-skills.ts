import { IDL_MCP_LOG } from '@idl/logger';
import { ANALYTICS_REPOSITORY_REGISTRY } from '@idl/mcp/analytics-repository';
import type { MCPServer } from '@idl/mcp/server';
import { MCPSkillRegistry } from '@idl/mcp/skills';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

/**
 * Global singleton instance of the skill registry
 */
export const MCP_SKILL_REGISTRY = new MCPSkillRegistry();

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
      // refresh repository skills so we always have the latest versions
      try {
        registry.replaceRepositorySkills(
          await ANALYTICS_REPOSITORY_REGISTRY.getSkillPackages(),
        );
      } catch (err) {
        server.logManager.log({
          log: IDL_MCP_LOG,
          type: 'error',
          content: [
            'Unable to refresh skills from analytics repositories',
            err,
          ],
        });
      }

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
