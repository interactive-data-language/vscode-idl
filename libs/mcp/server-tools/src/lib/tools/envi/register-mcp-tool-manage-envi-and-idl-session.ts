import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_ManageENVIAndIDLSession,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';
import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-intall-message.interface';

/**
 * Registers a tool that allows LLMs to manage ENVI and IDL sessions
 */
export function RegisterMCPTool_ManageENVIAndIDLSession(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.MANAGE_ENVI_AND_IDL_SESSION,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.MANAGE_ENVI_AND_IDL_SESSION
        ],
      description:
        'Manages the current ENVI and IDL session. Allows you to stop IDL (and ENVI), restart IDL, and relauch ENVI with/without the UI.',
      inputSchema: {
        action: z
          .enum([
            'restart-envi-headless',
            'restart-envi-ui',
            'restart-idl',
            'stop',
          ])
          .describe(
            'Action to take on the session. "stop" stops the current session, "restart-idl" restarts IDL only, "restart-envi-ui" restarts ENVI with UI displayed, "restart-envi-headless" restarts ENVI without UI'
          ),
      },
    },
    async (id, { action }) => {
      // check actions and make sure ENVI is installed
      if (
        (action === 'restart-envi-ui' || action === 'restart-envi-headless') &&
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

      // strictly typed parameters
      const params: MCPToolParams<MCPTool_ManageENVIAndIDLSession> = {
        action,
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.MANAGE_ENVI_AND_IDL_SESSION,
          params,
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
