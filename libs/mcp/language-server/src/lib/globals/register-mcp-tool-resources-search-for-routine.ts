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
  s: 'StructureOrClassDefinition',
  sv: 'SystemVariable',
};

const reverseMap: { [key: string]: GlobalTokenType } = {
  CommonBlock: 'c',
  Function: 'f',
  FunctionMethod: 'fm',
  Procedure: 'p',
  ProcedureMethod: 'pm',
  StructureOrClassDefinition: 's',
  SystemVariable: 'sv',
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
    `Searches our language server for matching routines. Checks known functions, procedures, function methods, procedure methods, structures, and system variables. Returns matches for each type.`,
    {
      queries: z
        .array(
          z.object({
            name: z
              .string()
              .describe(
                'The name to search for, uses fuzzy search. For methods use "ClassName::MethodName" or "::MethodName" or "MethodName"'
              ),
            routineType: z
              .enum([
                'All',
                'Function',
                'FunctionMethod',
                'Procedure',
                'ProcedureMethod',
                'StructureOrClassDefinition',
                'SystemVariable',
              ])
              .default('All')
              .describe(
                'The type of search to make. Default searches all types, or you can select a specific type of routine'
              ),
          })
        )
        .describe(
          'The search queries to look for. Returns an object of matches for each query'
        ),
    },
    async (id, { queries }) => {
      /** Init results */
      const response: any[] = [];

      // process each query
      for (let i = 0; i < queries.length; i++) {
        /** Get search name */
        const name = queries[i].name;

        /** Get search routine type */
        const routineType = queries[i].routineType;

        /** init results */
        const queryResults: { [key: string]: GlobalIndexedToken[] } = {};

        /**
         * Get the types we search for
         */
        const globalTypes: GlobalTokenType[] =
          routineType in reverseMap
            ? [reverseMap[routineType]]
            : Object.values(GLOBAL_TOKEN_TYPES);

        /** Perform a search */
        for (let j = 0; j < globalTypes.length; j++) {
          if (globalTypes[j] === GLOBAL_TOKEN_TYPES.COMMON) {
            continue;
          }

          // search and merge results
          queryResults[mappedNames[globalTypes[j]]] =
            index.globalIndex.findMatchingGlobalToken(
              globalTypes[j],
              name,
              true,
              2
            );
        }

        // save results for this query
        response.push(queryResults);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response),
          },
        ],
      };
    }
  );
}
