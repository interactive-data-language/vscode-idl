import { MCPPromptRegistry } from '@idl/mcp/prompts';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { MCPToolHelper } from '../mcp-tool-helper.class';

/**
 * List registered prompts
 */
export function RegisterMCPTool_ListPrompts(
  helper: MCPToolHelper,
  registry: MCPPromptRegistry
) {
  helper.registerTool(
    MCP_TOOL_LOOKUP.LIST_PROMPTS,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.LIST_PROMPTS],
      description:
        'Returns a list of available prompts by category. Prompts contain specialized instructions, best practices, and workflow guidance. Use this before starting complex tasks with ENVI and IDL to check if relevant guidance exists.',
      inputSchema: {
        filter: z
          .enum(['envi', 'idl', 'all'])
          .default('all')
          .describe('Filter by: ENVI prompts, IDL prompts, or ALL prompts.'),
      },
    },
    async (id, { filter }) => {
      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: JSON.stringify(registry.descriptions(filter)),
          },
        ],
      };
    }
  );
}
