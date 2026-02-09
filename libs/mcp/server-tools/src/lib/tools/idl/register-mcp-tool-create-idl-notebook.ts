import { CleanPath } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { MCPToolHelper } from '../../mcp-tool-helper.class';

/**
 * Registers a tool that creates an IDL Notebook
 */
export function RegisterMCPTool_CreateIDLNotebook(helper: MCPToolHelper) {
  helper.registerTool(
    MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK
        ],
      description:
        'Creates an IDL Notebook and should always be used when asked to create notebooks for IDL code. This is a native IDL Notebook and does not use or require Jupyter or require other configuration in order to work. When writing code to add, you do not need to add "compile_opt idl2" to cells as IDL Notebooks always run with this option set.',
      inputSchema: {
        uri: z
          .string()
          .describe(
            'The fully qualified filepath to where the notebook should live on disk. It needs to have a ".idlnb" file extension.'
          ),
        cells: z
          .array(
            z.object({
              type: z
                .union([z.literal('markdown'), z.literal('code')])
                .describe(
                  'The type of the notebook cell. Markdown cells are informational whereas code cell contain the logic that runs'
                ),
              content: z
                .string()
                .describe(
                  'The content of the notebook cell as a single-line string separated by new line characters'
                ),
            })
          )
          .describe('The content for the IDL Notebook file'),
      },
    },
    async (id, { uri, cells }) => {
      const resp = await helper.sendRequestToVSCode(
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
        }
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
    }
  );
}
