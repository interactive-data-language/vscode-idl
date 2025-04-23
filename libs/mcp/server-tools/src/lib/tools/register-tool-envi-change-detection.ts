import { MCP_SERVER } from '@idl/mcp/server';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_ENVIChangeDetection,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

/**
 * Registers a tool that allows us to open an image in ENVI
 */
export function RegisterToolENVIChangeDetection(
  messenger: VSCodeLanguageServerMessenger
) {
  MCP_SERVER.tool(
    MCP_TOOL_LOOKUP.ENVI_CHANGE_DETECTION,
    'Runs change detection in ENVI using two separate images over an area of interest. Creates a visual change detection result to allow users to inspect their area of interest and quantify changes.',
    {
      time1Uri: z
        .string()
        .describe(
          'The local file that represents the first time for change detection'
        ),
      time2Uri: z
        .string()
        .describe(
          'The local file that represents the second time for change detection'
        ),
    },
    async ({ time1Uri, time2Uri }) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_ENVIChangeDetection> = {
        time1Uri,
        time2Uri,
      };

      // request work to happen
      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          tool: MCP_TOOL_LOOKUP.ENVI_CHANGE_DETECTION,
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
