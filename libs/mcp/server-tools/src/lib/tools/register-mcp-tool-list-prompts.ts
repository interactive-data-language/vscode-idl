import { MCPResourceIndex } from '@idl/mcp/server-resources';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { MCPToolHelper } from '../mcp-tool-helper.class';

/**
 * List registered prompts
 */
export function RegisterMCPTool_ListPrompts(helper: MCPToolHelper) {
  helper.registerTool(
    MCP_TOOL_LOOKUP.LIST_PROMPTS,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.LIST_PROMPTS],
      description:
        'Returns a list of available prompts by category. Prompts contain specialized instructions, best practices, and workflow guidance. Use this before starting complex tasks to check if relevant guidance exists. Filter by: ENVI (image processing), IDL (general programming), or ALL (default).',
      inputSchema: {
        category: z
          .enum(['ENVI', 'IDL', 'ALL'])
          .optional()
          .describe(
            'Category to filter prompts by: "ENVI" for ENVI-specific prompts, "IDL" for IDL-specific prompts, or "ALL" for all prompts.'
          ),
      },
    },
    async (id, { category = 'ALL' }) => {
      /** Init results */
      let results: string[] = [];

      // Filter by category based on folder prefix
      if (category === 'ALL') {
        results = MCPResourceIndex.list().filter(
          (result) =>
            result.startsWith('prompts-idl-') ||
            result.startsWith('prompts-envi-')
        );
      } else if (category === 'ENVI') {
        results = MCPResourceIndex.list().filter((result) =>
          result.startsWith('prompts-envi-')
        );
      } else if (category === 'IDL') {
        results = MCPResourceIndex.list().filter((result) =>
          result.startsWith('prompts-idl-')
        );
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
