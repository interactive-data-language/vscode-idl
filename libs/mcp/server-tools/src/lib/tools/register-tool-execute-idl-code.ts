import { MCP_SERVER } from '@idl/mcp/server';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_ExecuteIDLCode,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

/**
 * Registers a tool that allows us to start IDL
 */
export function RegisterToolExecuteIDLCode(
  messenger: VSCodeLanguageServerMessenger
) {
  MCP_SERVER.tool(
    MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE,
    'Executes a string of IDL code. There can be multiple lines of code which will be prepared, executed, and standard output will be returned.',
    {
      code: z
        .string()
        .describe(
          'The IDL code that should be executed. The code will always run with IDL\'s `idl2` compile option set and, if needed, will have an "end" statement appended to the code before it runs.'
        ),
    },
    async ({ code }) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_ExecuteIDLCode> = {
        code,
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          tool: MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE,
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
