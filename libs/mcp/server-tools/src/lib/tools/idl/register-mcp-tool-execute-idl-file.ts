import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { MCPToolHelper } from '../../mcp-tool-helper.class';
import { EXECUTE_IDL_FILE_DESCRIPTION } from './register-mcp-tool-execute-idl-file.interface';

/**
 * Registers a tool that runs a file of IDL code
 */
export function RegisterMCPTool_ExecuteIDLFile(helper: MCPToolHelper) {
  helper.registerTool(
    MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE
        ],
      description: EXECUTE_IDL_FILE_DESCRIPTION,
      inputSchema: {
        uri: z
          .string()
          .describe(
            'The fully-qualified path to a file on disk that contains IDL code that should run.'
          ),
      },
    },
    async (id, { uri }) => {
      const resp = await helper.sendRequestToVSCode(
        id,
        MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE,
        {
          uri,
        }
      );

      return {
        isError: !resp.success,
        content: [
          {
            type: 'text',
            text: JSON.stringify(resp),
          },
        ],
      };
    }
  );
}
