import {
  MCP_TOOL_LOOKUP,
  MCPTool_StartIDL,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { MCPToolRegistry } from '../mcp-tool-registry.class';

/**
 * Registers a tool that allows us to start IDL
 */
export function RegisterToolStartIDL(messenger: VSCodeLanguageServerMessenger) {
  MCPToolRegistry.tool(
    MCP_TOOL_LOOKUP.START_IDL,
    "Starts a new session of IDL in VSCode. If IDL has already started, this tool won't do anything.",
    {},
    async (id) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_StartIDL> = {};

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.START_IDL,
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
