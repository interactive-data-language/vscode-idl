import { CleanPath } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_CreateIDLNotebook,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/**
 * Registers a tool that creates an IDL Notebook
 */
export function RegisterMCPTool_CreateIDLNotebook(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK
        ],
      description:
        'Creates an IDL Notebook.\n\nThis is a native IDL Notebook and does not use or require Jupyter or any other configuration in order to work.',
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
      // strictly typed parameters and make sure we always have content in the cells
      const params: MCPToolParams<MCPTool_CreateIDLNotebook> = {
        uri: CleanPath(uri),
        cells: cells.map((cell) => {
          return {
            type: cell?.type || 'markdown',
            content: cell?.content || '',
          };
        }),
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK,
          params,
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
