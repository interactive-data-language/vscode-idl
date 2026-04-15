import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { IS_ENVI_INSTALLED } from '../..';
import { ENVI_INSTALL_MESSAGE } from './envi/envi-install-message.interface';

/**
 * Registers a tool that allows LLMs to manage ENVI and IDL sessions
 */
export function RegisterMCPTool_ManageIDLAndENVISession(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.MANAGE_IDL_AND_ENVI_SESSION,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.MANAGE_IDL_AND_ENVI_SESSION
        ],
      description:
        'Allows you to manage session of IDL and ENVI including: starting, stopping, or restarting each application. This is a helper tool, running IDL or ENVI tools will automatically start IDL and ENVI.',
      inputSchema: {
        action: z
          .enum([
            'restart-envi-headless',
            'restart-envi',
            'restart-idl',
            'start-envi-headless',
            'start-envi',
            'start-idl',
            'stop',
          ])
          .describe(
            'Action to take on the session. The "headless" ENVI actions do not launch the UI, only use these when instructed by the user.',
          ),
      },
    },
    async (id, { action }) => {
      // check actions and make sure ENVI is installed
      if (
        (action === 'restart-envi' ||
          action === 'restart-envi-headless' ||
          action === 'start-envi' ||
          action === 'start-envi-headless') &&
        !IS_ENVI_INSTALLED
      ) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: ENVI_INSTALL_MESSAGE,
            },
          ],
        };
      }

      const resp = await server.sendIDLRequest(
        id,
        MCP_TOOL_LOOKUP.MANAGE_IDL_AND_ENVI_SESSION,
        {
          action,
        },
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
