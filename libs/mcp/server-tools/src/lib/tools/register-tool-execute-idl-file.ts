import { MCP_SERVER } from '@idl/mcp/server';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_ExecuteIDLFile,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { EXECUTE_IDL_CODE_DESCRIPTION } from './register-tool-execute-idl-code.interface';

/**
 * Registers a tool that runs a file of IDL code
 */
export function RegisterToolExecuteIDLFile(
  messenger: VSCodeLanguageServerMessenger
) {
  MCP_SERVER.tool(
    MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE,
    EXECUTE_IDL_CODE_DESCRIPTION,
    {
      uri: z
        .string()
        .describe(
          'The fully-qualified path to a file on disk that contains IDL code that should run.'
        ),
    },
    async ({ uri }) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_ExecuteIDLFile> = {
        uri,
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          tool: MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE,
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
