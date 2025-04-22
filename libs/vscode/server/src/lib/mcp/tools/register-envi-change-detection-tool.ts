import { MCP_SERVER } from '@idl/mcp/server';
import {
  MCP_TOOL_LOOKUP,
  MCPENVIChangeDetection,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { z } from 'zod';

import { SERVER_EVENT_MANAGER } from '../../initialize-server';

/**
 * Registers a tool that allows us to open an image in ENVI
 */
export function RegisterENVIChangeDetectionTool() {
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
      const params: MCPToolParams<MCPENVIChangeDetection> = {
        time1Uri,
        time2Uri,
      };

      // request work to happen
      const resp = await SERVER_EVENT_MANAGER.sendRequest(
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
