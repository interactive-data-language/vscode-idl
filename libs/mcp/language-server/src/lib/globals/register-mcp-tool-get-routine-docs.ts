import { MCPToolRegistry } from '@idl/mcp/server-tools';
import { IDLIndex } from '@idl/parsing/index';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import {
  GET_ROUTINE_DOCS_DESCRIPTION,
  NO_MATCHES,
} from './register-mcp-tool-get-routine-docs.interface';
import { reverseMap } from './register-mcp-tool-search-for-routine.interface';

/**
 * Gets docs for a routine, up to one match for each request
 *
 * Returns a trimmed down chunk of information from the global
 * to remove excess string/tokens that the LLM has to process
 */
export function RegisterMCPTool_GetRoutineDocs(
  messenger: VSCodeLanguageServerMessenger,
  index: IDLIndex
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.GET_ROUTINE_DOCS,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.GET_ROUTINE_DOCS
        ],
      description: GET_ROUTINE_DOCS_DESCRIPTION,
      inputSchema: {
        routines: z
          .array(
            z.object({
              name: z
                .string()
                .describe(
                  'The name to return docs for, case insensitive. For methods use "ClassName::MethodName" or "::MethodName" or "MethodName"'
                ),
              type: z
                .enum([
                  'Function',
                  'FunctionMethod',
                  'Procedure',
                  'ProcedureMethod',
                  'StructureOrClassDefinition',
                  'SystemVariable',
                ])
                .describe('The type of routine to search for.'),
            })
          )
          .describe(
            'The routines to return docs for, returns the first match or an empty array for no matches.'
          ),
      },
    },
    async (id, { routines }) => {
      /** Init results */
      const response: any[][] = [];

      // process each query
      for (let i = 0; i < routines.length; i++) {
        /** Get search name */
        const name = routines[i].name;

        /** Get search routine type */
        const routineType = routines[i].type;

        // save results for this query
        response.push(
          index.globalIndex
            .findMatchingGlobalToken(reverseMap[routineType], name)
            .slice(0, 1)
            .map((g) => {
              return {
                type: routineType,
                name: g.name,
                displayName: g.meta.display,
                file: g.file,
                routineSource: g.meta.source,
                docs: g.meta.docs,
              };
            })
        );
      }

      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              response.map((items) => {
                if (items.length === 0) {
                  return NO_MATCHES;
                } else {
                  return items[0];
                }
              })
            ),
          },
        ],
      };
    }
  );
}
