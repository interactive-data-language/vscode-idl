import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { MANAGE_IDL_DEBUGGER_DESCRIPTION } from './register-mcp-tool-manage-idl-debugger.interface';

/**
 * Registers the manage-idl-debugger tool
 */
export function RegisterMCPTool_ManageIDLDebugger(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.MANAGE_IDL_DEBUGGER,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.MANAGE_IDL_DEBUGGER
        ],
      description: MANAGE_IDL_DEBUGGER_DESCRIPTION,
      inputSchema: {
        action: z
          .enum([
            'set-breakpoint',
            'clear-breakpoint',
            'clear-all-breakpoints',
            'list-breakpoints',
            'continue',
            'step-in',
            'step-over',
            'step-out',
            'get-stack',
          ])
          .describe('The debugger action to perform.'),
        file: z
          .string()
          .optional()
          .describe(
            'File path for set-breakpoint and clear-breakpoint actions.',
          ),
        // This is 1 based.
        line: z
          .number()
          .optional()
          .describe(
            'Line number for set-breakpoint and clear-breakpoint actions. This is 1 based.',
          ),
      },
    },
    async (id, { action, file, line }) => {
      const resp = await server.sendIDLRequest(
        id,
        MCP_TOOL_LOOKUP.MANAGE_IDL_DEBUGGER,
        { action, file, line },
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
