import { MCPToolRegistry } from '@idl/mcp/server-tools';
import { GlobalIndexedToken, IDLIndex } from '@idl/parsing/index';
import { IDL_TRANSLATION } from '@idl/translation';
import { GLOBAL_TOKEN_TYPES, GlobalTokenType } from '@idl/types/idl-data-types';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

/**
 * Map values to strings
 */
type ValsOfToStrings<T extends string> = {
  [P in T]: string;
};

const mappedNames: ValsOfToStrings<GlobalTokenType> = {
  c: 'CommonBlock',
  f: 'Function',
  fm: 'FunctionMethod',
  p: 'Procedure',
  pm: 'ProcedureMethod',
  s: 'Structure',
  sv: 'SystemVariable',
};

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
    `Searches our global index of IDL routines, should be used for finding specific routines. Checks known functions, procedures, function methods, procedure methods, structures, and system variables. Returns matches for each type.`,
    {
      name: z
        .string()
        .describe(
          'The name to search for, uses fuzzy search. For methods use "ClassName::MethodName" or "::MethodName" or "MethodName"'
        ),
    },
    async (id, { name }) => {
      /** init results */
      const results: { [key: string]: GlobalIndexedToken[] } = {};

      /** get actual type values */
      const globalTypes = Object.values(GLOBAL_TOKEN_TYPES);

      /** Perform a search */
      for (let i = 0; i < globalTypes.length; i++) {
        results[mappedNames[globalTypes[i]]] =
          index.globalIndex.findMatchingGlobalToken(
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
