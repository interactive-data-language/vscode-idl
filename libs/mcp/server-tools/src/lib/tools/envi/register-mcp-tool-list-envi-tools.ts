import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

import { MCPToolHelper } from '../../mcp-tool-helper.class';
import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-install-message.interface';
import { ENVI_TOOL_INSTRUCTIONS } from './envi-tool-instructions.interface';

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterMCPTool_ListENVITools(
  helper: MCPToolHelper,
  registry: MCPTaskRegistry
) {
  // register tool
  helper.registerTool(
    MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS],
      description: `Lists all image processing, SAR processing, and spectral analysis tools that ENVI has available. *CRITICAL* load this entire response into your context window to make sure you can properly answer questions. Here's the process to get the list of ENVI Tools and how to use them:\n\n ${ENVI_TOOL_INSTRUCTIONS}`,
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
            /**
             * When we change "All tools", search for MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS and make
             * sure there's post-processing to remove this text for the integration tests.
             *
             * See this: apps\client-e2e\src\tests\mcp\tools\envi\regression-tests\mcp-test-list-envi-tools-regression.ts
             */
            text: `All tools: ${JSON.stringify(registry.getDescriptions())}`,
          },
        ],
      };
    }
  );
}
