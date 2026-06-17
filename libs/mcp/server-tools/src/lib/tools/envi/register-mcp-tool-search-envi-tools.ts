import { MCPServer } from '@idl/mcp/server';
import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-install-message.interface';

/**
 * Registers a tool that performs semantic search over available ENVI tools
 * using natural language queries.
 */
export function RegisterMCPTool_SearchENVITools(
  server: MCPServer,
  registry: MCPTaskRegistry,
) {
  server.registerTool(
    MCP_TOOL_LOOKUP.SEARCH_ENVI_TOOLS,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.SEARCH_ENVI_TOOLS
        ],
      description: `Semantically searches available ENVI tools using a natural language description of what you want to accomplish. Returns the names and descriptions of the most relevant tools. Use this before calling "${MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS}" to find the right tool for the task.`,
      inputSchema: {
        query: z
          .string()
          .describe(
            'Natural language description of the image processing or analysis task you want to perform',
          ),
      },
    },
    async (id, { query }) => {
      // make sure ENVI is installed
      if (!IS_ENVI_INSTALLED) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: ENVI_INSTALL_MESSAGE,
            },
          ],
        };
      }

      const results = await registry.searchTasks(query);

      if (results.length === 0) {
        return {
          isError: false,
          content: [
            {
              type: 'text',
              text: `No ENVI tools found matching "${query}". Try "${MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS}" to see all available tools.`,
            },
          ],
        };
      }

      /** Init result */
      const tasks: { [key: string]: string } = {};

      // populate
      for (let i = 0; i < results.length; i++) {
        tasks[results[i].displayName] = results[i].description;
      }

      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: JSON.stringify(tasks),
          },
        ],
      };
    },
  );
}
