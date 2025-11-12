import {
  MCP_TOOL_LOOKUP,
  MCPTool_ENVIOpenDataset,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/**
 * Registers a tool that allows us to open an image in ENVI
 */
export function RegisterMCPTool_ENVIOpenDataset(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.ENVI_OPEN_DATASET,
    'Open an image in ENVI and shows it in the display. Easy way to view imagery for users. See https://www.nv5geospatialsoftware.com/docs/SupportedFormats.html for which files to open as the main raster file.',
    {
      uri: z
        .string()
        .describe(
          'The local file to open in ENVI. Should be a fully-qualified filepath.'
        ),
    },
    async (id, { uri }) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_ENVIOpenDataset> = {
        display: true,
        uri,
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.ENVI_OPEN_DATASET,
          params,
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `Tool execution status: ${JSON.stringify(resp)}`,
          },
        ],
      };
    }
  );
}
