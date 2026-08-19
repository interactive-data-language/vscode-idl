import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { CONTROL_IDL_DEBUGGER_DESCRIPTION } from './register-mcp-tool-control-idl-debugger.interface';

/**
 * Registers the control-idl-debugger tool
 */
export function RegisterMCPTool_ControlIDLDebugger(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.CONTROL_IDL_DEBUGGER,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.CONTROL_IDL_DEBUGGER
        ],
      description: CONTROL_IDL_DEBUGGER_DESCRIPTION,
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
        MCP_TOOL_LOOKUP.CONTROL_IDL_DEBUGGER,
        { action, file, line },
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
    },
  );
}
