import { IDL_MCP_LOG } from '@idl/logger';
import { MCPResourceIndex } from '@idl/mcp/server-resources';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { MCPToolHelper } from '../mcp-tool-helper.class';

/**
 * Search through registered resources
 */
export function RegisterMCPTool_SearchResources(helper: MCPToolHelper) {
  helper.registerTool(
    MCP_TOOL_LOOKUP.SEARCH_RESOURCES,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.SEARCH_RESOURCES
        ],
      description: `Searches known resources about IDL and ENVI. Resources include tutorials, how-to guides, examples IDL notebooks, and language specifics. If you are searching for routines, start with "${MCP_TOOL_LOOKUP.SEARCH_FOR_ROUTINE}" instead.`,
      inputSchema: {
        queries: z
          .array(z.string())
          .describe(
            'The queries to search for, uses fuzzy-style searching so queries should be shorter.'
          ),
      },
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

      helper.logManager.log({
        log: IDL_MCP_LOG,
        type: 'debug',
        content: [
          `Searched for ${queries.length} queries in ${
            performance.now() - t0
          } ms `,
          queries,
        ],
      });

      // return
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
