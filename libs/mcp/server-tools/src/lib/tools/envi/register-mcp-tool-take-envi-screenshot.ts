import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-install-message.interface';

/**
 * Registers a tool that takes a screenshot of the ENVI display
 */
export function RegisterMCPTool_TakeENVIScreenshot(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.TAKE_ENVI_SCREENSHOT,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.TAKE_ENVI_SCREENSHOT
        ],
      description:
        'Takes a screenshot of the current ENVI display and returns the image as a base64-encoded PNG. ENVI must already be running with an active display. **CRITICAL**: Run a sub-agent to retrieve the image and analyze it to reduce token costs.',
      inputSchema: {},
    },
    async (id) => {
      // make sure ENVI is installed
      if (!IS_ENVI_INSTALLED) {
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

      // send request
      const resp = await server.sendIDLRequest(
        id,
        MCP_TOOL_LOOKUP.TAKE_ENVI_SCREENSHOT,
        {},
      );

      return {
        isError: !resp.success,
        content: resp.screenshotBase64
          ? [
              {
                type: 'image',
                data: resp.screenshotBase64,
                mimeType: 'image/jpeg',
              },
            ]
          : [
              {
                type: 'text',
                text: JSON.stringify(resp), // error/fallback path
              },
            ],
      };
    },
  );
}
