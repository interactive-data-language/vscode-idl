import { MCPToolRegistry } from '@idl/mcp/server-tools';
import { GlobalIndexedToken, IDLIndex } from '@idl/parsing/index';
import { IDL_TRANSLATION } from '@idl/translation';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/idl-data-types';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

/**
 * Search through registered resources
 */
export function RegisterMCPTool_ResourcesSearchForRoutine(
  messenger: VSCodeLanguageServerMessenger,
  index: IDLIndex
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.RESOURCES_SEARCH_FOR_ROUTINE,
    IDL_TRANSLATION.mcp.tools.displayNames[
      MCP_TOOL_LOOKUP.RESOURCES_SEARCH_FOR_ROUTINE
    ],
    `Searches our global index of IDL routines. Searches through functions, procedures, function methods, procedure methods, structures, and system variables. Returns matches for each type`,
    {
      name: z.string().describe('The name to search for, uses fuzzy search.'),
    },
    async (id, { name }) => {
      /** init results */
      const results: { [key: string]: GlobalIndexedToken[] } = {};

      /** Get all types of tokens that we search for */
      const globalNames = Object.keys(GLOBAL_TOKEN_TYPES).map((key) =>
        key.toLowerCase()
      );

      /** get actual type values */
      const globalTypes = Object.values(GLOBAL_TOKEN_TYPES);

      /** Perform a search */
      for (let i = 0; i < globalTypes.length; i++) {
        results[globalNames[i]] = index.globalIndex.findMatchingGlobalToken(
          globalTypes[i],
          name,
          true,
          2
        );
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
