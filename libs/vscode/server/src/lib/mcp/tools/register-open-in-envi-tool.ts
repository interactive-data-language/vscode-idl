import { MCP_SERVER } from '@idl/mcp/server';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { z } from 'zod';

import { SERVER_EVENT_MANAGER } from '../../initialize-server';

/**
 * Registers a tool that allows us to open an image in ENVI
 */
export function RegisterOpenInENVITool() {
  MCP_SERVER.tool(
    MCP_TOOL_LOOKUP.OPEN_IN_ENVI,
    'Open an image in ENVI',
    {
      uri: z.string().describe('The local file to open in ENVI'),
    },
    async ({ uri }) => {
      const resp = await SERVER_EVENT_MANAGER.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          tool: MCP_TOOL_LOOKUP.OPEN_IN_ENVI,
          params: {
            display: true,
            uri,
          },
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
