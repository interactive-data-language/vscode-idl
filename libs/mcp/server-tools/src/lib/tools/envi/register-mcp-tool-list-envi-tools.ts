import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';
import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-intall-message.interface';
import { ENVI_TOOL_INSTRUCTIONS } from './envi-tool-instructions.interface';

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterMCPTool_ListENVITools(
  messenger: VSCodeLanguageServerMessenger,
  registry: MCPTaskRegistry
) {
  // register tool
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS],
      description: `Lists all image processing and spectral analysis tools that ENVI has available. Here's the process to get the list of ENVI Tools and how to use them:\n\n ${ENVI_TOOL_INSTRUCTIONS}`,
      inputSchema: {},
    },
    async (id, inputParameters) => {
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

      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: JSON.stringify(registry.getDescriptions()),
          },
        ],
      };
    }
  );
}
