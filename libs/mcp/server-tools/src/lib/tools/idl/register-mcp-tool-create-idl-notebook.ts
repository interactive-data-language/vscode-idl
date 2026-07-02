import { MCPServer } from '@idl/mcp/server';
import { CleanPath } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { CREATE_IDL_NOTEBOOK_DESCRIPTION } from './register-mcp-tool-create-idl-notebook.interface';

/**
 * Registers a tool that creates an IDL Notebook
 */
export function RegisterMCPTool_CreateIDLNotebook(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK
        ],
      description: CREATE_IDL_NOTEBOOK_DESCRIPTION,
      inputSchema: {
        uri: z
          .string()
          .describe(
            'The fully qualified filepath to where the notebook should live on disk. It needs to have a ".idlnb" file extension.',
          ),
        cells: z
          .array(
            z.object({
              type: z
                .union([z.literal('markdown'), z.literal('code')])
                .describe(
                  'The type of the notebook cell. Markdown cells are informational whereas code cell contain the logic that runs',
                ),
              content: z
                .string()
                .describe(
                  'The content of the notebook cell as a single-line string separated by new line characters',
                ),
            }),
          )
          .describe('The content for the IDL Notebook file'),
      },
    },
    async (id, { uri, cells }) => {
      /**
       * Note: This "sends and IDL request" meaning that it
       * doesn't actually invoke anything in IDL.
       *
       * This is primarily here for VSCode user experience which enables
       * us to create and open the notebook in VSCode
       *
       * Sending IDL a request here enables us to access VSCode directly
       * because VSCode APIs are available where IDL is running there
       *
       * For the standalone MCP server without VSCode, we utilize our helper
       * function to create the notebook without opening in VSCOde, so there
       * are two paths
       *
       * This is the helper we use: libs\mcp\idl\src\lib\create-idl-notebook.ts
       */
      const resp = await server.sendIDLRequest(
        id,
        MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK,
        {
          uri: CleanPath(uri),
          cells: cells.map((cell) => {
            return {
              type: cell?.type || 'markdown',
              content: cell?.content || '',
            };
          }),
        },
      );

      return {
        isError: !resp.success,
        content: [
          {
            type: 'text',
            text: JSON.stringify(resp),
          },
        ],
      };
    },
  );
}
