import {
  MCP_TOOL_LOOKUP,
  MCPTool_ENVIStart,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/**
 * Registers a tool that allows us to start ENVI
 */
export function RegisterMCPTool_ENVIStart(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.tool(
    MCP_TOOL_LOOKUP.ENVI_START,
    "Starts a session of ENVI and IDL in VSCode. If ENVI has already started, this tool won't do anything.",
    {
      headless: z.boolean().describe('Should ENVI be started without the UI?'),
    },
    async (id, { headless }) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_ENVIStart> = {
        headless,
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.ENVI_START,
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
