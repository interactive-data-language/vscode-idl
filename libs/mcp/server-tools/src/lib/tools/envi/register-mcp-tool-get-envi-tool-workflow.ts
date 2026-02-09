import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { MCPToolHelper } from '../../mcp-tool-helper.class';
import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-intall-message.interface';
import { ENVI_TOOL_WORKFLOW_INSTRUCTIONS } from './envi-tool-workflow-instructions.interface';
import { ENVI_TOOL_WORKFLOW_REGISTRY } from './register-mcp-tool-list-envi-tool-workflows';

/**
 * Registers MCP tool that retrieves a tool workflo by name
 */
export function RegisterMCPTool_GetENVIToolWorkflow(helper: MCPToolHelper) {
  // register tool
  helper.registerTool(
    MCP_TOOL_LOOKUP.GET_ENVI_TOOL_WORKFLOW,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.GET_ENVI_TOOL_WORKFLOW
        ],
      description: `Returns an description of how you chain together ENVI Tools to solve specific problem. Used as a starting point to plan remote sensing workflows. Instructions for tool usage: ${ENVI_TOOL_WORKFLOW_INSTRUCTIONS}`,
      inputSchema: {
        name: z.string().describe('The name of the workflow to retrieve'),
      },
    },
    async (id, { name }) => {
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

      // make sure it exists
      if (!ENVI_TOOL_WORKFLOW_REGISTRY.hasWorkflow(name)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Unknown ENVI Tool workflow of "${name}", did you retrieve the workflow names from ${MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS}?`,
            },
          ],
        };
      }

      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: ENVI_TOOL_WORKFLOW_REGISTRY.getWorkflow(name),
          },
        ],
      };
    }
  );
}
