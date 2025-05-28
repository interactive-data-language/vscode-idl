import {
  MCP_TOOL_LOOKUP,
  MCPTool_OpenInENVI,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../mcp-tool-registry.class';

/**
 * Registers a tool that allows us to open an image in ENVI
 */
export function RegisterToolOpenInENVI(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.tool(
    MCP_TOOL_LOOKUP.OPEN_IN_ENVI,
    'Open an image in ENVI',
    {
      uri: z
        .string()
        .describe(
          'The local file to open in ENVI. Should be a fully-qualified filepath.'
        ),
    },
    async (id, { uri }) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_OpenInENVI> = {
        display: true,
        uri,
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.OPEN_IN_ENVI,
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
