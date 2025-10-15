import {
  MCP_TOOL_LOOKUP,
  MCPTool_ExecuteIDLCode,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../mcp-tool-registry.class';
import { EXECUTE_IDL_CODE_DESCRIPTION } from './register-tool-execute-idl-code.interface';

/**
 * Registers a tool that runs IDL code
 */
export function RegisterToolExecuteIDLCode(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.tool(
    MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE,
    EXECUTE_IDL_CODE_DESCRIPTION,
    {
      code: z
        .string()
        .describe(
          "The IDL code that should be executed. The code will always run with IDL's `idl2` compile option set and, if needed, will have an \"end\" statement appended to the code before it runs. If there is a file that should run, then the syntax to execute should follow the form:\n\n```idl\n.compile'C:\\path-to-file\\my_file.pro'"
        ),
    },
    async (id, { code }) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_ExecuteIDLCode> = {
        code,
      };

      // send request
      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE,
          params,
        }
      );

      // return
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
