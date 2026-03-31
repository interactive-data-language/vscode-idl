import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { EXECUTE_IDL_CODE_DESCRIPTION } from './register-mcp-tool-execute-idl-code.interface';

/**
 * Registers a tool that runs IDL code
 */
export function RegisterMCPTool_ExecuteIDLCode(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE
        ],
      description: EXECUTE_IDL_CODE_DESCRIPTION,
      inputSchema: {
        code: z
          .string()
          .describe(
            "The IDL code that should be executed. The code will always run with IDL's `idl2` compile option set and, if needed, will have an \"end\" statement appended to the code before it runs. If there is a file that should run, then the syntax to execute should follow the form:\n\n```idl\n.compile'C:\\path-to-file\\my_file.pro'",
          ),
      },
    },
    async (id, { code }) => {
      // send request
      const resp = await server.sendIDLRequest(
        id,
        MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE,
        { code },
      );

      // return
      return {
        isError: !resp.success,
        content: [
          {
            type: 'text',
            text: JSON.stringify(resp),
          },
        ],
      };
    },
  );
}
