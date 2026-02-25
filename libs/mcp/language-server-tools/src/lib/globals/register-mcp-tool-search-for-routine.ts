import { MCPToolHelper } from '@idl/mcp/server-tools';
import { IDLIndex } from '@idl/parsing/index';
import { IDL_TRANSLATION } from '@idl/translation';
import { GLOBAL_TOKEN_TYPES, GlobalTokenType } from '@idl/types/idl-data-types';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import {
  mappedNames,
  reverseMap,
  SEARCH_FOR_ROUTINE_DESCRIPTION,
} from './register-mcp-tool-search-for-routine.interface';

/**
 * Search known routines for matches
 */
export function RegisterMCPTool_ResourcesSearchForRoutine(
  helper: MCPToolHelper,
  index: IDLIndex,
  getWorkspacesCallback: () => string[]
) {
  helper.registerTool(
    MCP_TOOL_LOOKUP.SEARCH_FOR_ROUTINE,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.SEARCH_FOR_ROUTINE
        ],
      description: SEARCH_FOR_ROUTINE_DESCRIPTION,
      inputSchema: {
        routines: z
          .array(
            z.object({
              name: z
                .string()
                .describe(
                  'The name to search for, case insensitive. For methods use "ClassName::MethodName" or "::MethodName" or "MethodName"'
                ),
              type: z
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
                .describe('The type of routine to search for.'),
            })
          )
          .describe(
            'The search queries to look for, returns an array of matches for each query.'
          ),
      },
    },
    async (id, { routines }) => {
      /** Init results */
      const response: any[] = [];

      // process each query
      for (let i = 0; i < routines.length; i++) {
        /** Get search name */
        const name = routines[i].name;

        /** Get search routine type */
        const routineType = routines[i].type;

        /** init results */
        const queryResults: { [key: string]: string[] } = {};

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
          queryResults[mappedNames[globalTypes[j]]] = index.globalIndex
            .findMatchingGlobalToken(globalTypes[j], name, {
              fuzzy: true,
              workspaceFilter: getWorkspacesCallback(),
            })
            .map((g) => g.name);
        }

        // save results for this query
        response.push(queryResults);
      }

      return {
        isError: false,
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
