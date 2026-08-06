import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { QUERY_IDL_SESSION_DESCRIPTION } from './register-mcp-tool-query-idl-session.interface';

/**
 * Registers a tool that queries the IDL session silently
 */
export function RegisterMCPTool_QueryIDLSession(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.QUERY_IDL_SESSION,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.QUERY_IDL_SESSION
        ],
      description: QUERY_IDL_SESSION_DESCRIPTION,
      inputSchema: {
        command: z
          .string()
          .describe(
            'The IDL command to evaluate silently. Output is captured and returned but not shown in the user debug console.',
          ),
      },
    },
    async (id, { command }) => {
      const resp = await server.sendIDLRequest(
        id,
        MCP_TOOL_LOOKUP.QUERY_IDL_SESSION,
        { command },
      );

      return {
        isError: !(resp).success,
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
