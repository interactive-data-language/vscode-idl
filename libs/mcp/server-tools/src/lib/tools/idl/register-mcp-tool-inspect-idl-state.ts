import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { INSPECT_IDL_STATE_DESCRIPTION } from './register-mcp-tool-inspect-idl-state.interface';

/** Registers the inspect-idl-state tool */
export function RegisterMCPTool_InspectIDLState(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.INSPECT_IDL_STATE,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.INSPECT_IDL_STATE
        ],
      description: INSPECT_IDL_STATE_DESCRIPTION,
      inputSchema: {
        action: z
          .enum([
            'get-info',
            'get-variables',
            'get-stack',
            'get-output',
            'get-errors',
            'get-coverage',
          ])
          .describe('The inspection action to perform.'),
        frameId: z
          .number()
          .optional()
          .describe(
            'Scope frame index for get-variables. Defaults to current frame (0).',
          ),
        file: z
          .string()
          .optional()
          .describe('File path required for get-coverage.'),
      },
    },
    async (id, { action, frameId, file }) => {
      const resp = await server.sendIDLRequest(
        id,
        MCP_TOOL_LOOKUP.INSPECT_IDL_STATE,
        { action, frameId, file },
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
