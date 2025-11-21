import { IDL_MCP_LOG, LogManager } from '@idl/logger';
import { MCPResourceIndex } from '@idl/mcp/server-resources';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/**
 * Search through registered resources
 */
export function RegisterMCPTool_ResourcesSearchResources(
  messenger: VSCodeLanguageServerMessenger,
  logger: LogManager
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.RESOURCES_SEARCH_RESOURCES,
    IDL_TRANSLATION.mcp.tools.displayNames[
      MCP_TOOL_LOOKUP.RESOURCES_SEARCH_RESOURCES
    ],
    `Searches known resources about IDL and ENVI and returns the top results with one or more queries. If you are searching for routines, start with ${MCP_TOOL_LOOKUP.RESOURCES_SEARCH_FOR_ROUTINE}.`,
    {
      queries: z
        .array(z.string())
        .describe(
          'The queries to search for, uses fuzzy-style searching so queries should be shorter.'
        ),
    },
    async (id, { queries }) => {
      /** Init results */
      let results: string[] = [];

      /** Get start time */
      const t0 = performance.now();

      // process all queries
      for (let i = 0; i < queries.length; i++) {
        results = results.concat(MCPResourceIndex.search(queries[i]));
      }

      logger.log({
        log: IDL_MCP_LOG,
        type: 'info',
        content: [
          `Searched for ${queries.length} queries in ${
            performance.now() - t0
          } ms `,
        ],
      });

      console.log(queries);

      // return
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
