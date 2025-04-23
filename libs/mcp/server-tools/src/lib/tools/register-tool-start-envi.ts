import { MCP_SERVER } from '@idl/mcp/server';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

/**
 * Registers a tool that allows us to start ENVI
 */
export function RegisterToolStartENVI(
  messenger: VSCodeLanguageServerMessenger
) {
  MCP_SERVER.tool(
    MCP_TOOL_LOOKUP.START_ENVI,
    'Starts ENVI',
    {
      headless: z.boolean().describe('Should ENVI be started without the UI?'),
    },
    async ({ headless }) => {
      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          tool: MCP_TOOL_LOOKUP.START_ENVI,
          params: {
            headless,
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
