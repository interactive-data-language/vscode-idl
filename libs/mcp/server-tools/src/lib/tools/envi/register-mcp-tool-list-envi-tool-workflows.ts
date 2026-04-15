import { MCPServer } from '@idl/mcp/server';
import { MCPToolWorkflowRegistry } from '@idl/mcp/tool-workflows';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-install-message.interface';
import { ENVI_TOOL_WORKFLOW_INSTRUCTIONS } from './envi-tool-workflow-instructions.interface';

/**
 * ENVI tool workflow registry
 */
export const ENVI_TOOL_WORKFLOW_REGISTRY = new MCPToolWorkflowRegistry();

/**
 * Track if we loaded notes or not
 */
let LOADED_NOTES = false;

/**
 * Track failure so we can report to the LLM
 */
let LOAD_FAILURE: string;

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterMCPTool_ListENVIToolWorkflows(server: MCPServer) {
  // register tool
  server.registerTool(
    MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS
        ],
      description: `Lists the names of known ENVI Tool Workflows that describe how you chain together ENVI Tools to solve different types of problems. Used as a starting point to plan remote sensing workflows. Instructions for tool usage: ${ENVI_TOOL_WORKFLOW_INSTRUCTIONS}`,
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

      // check for load failure
      if (LOAD_FAILURE) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Error when loading ENVI Tool workflows, unable to proceed. Error: ${LOAD_FAILURE}`,
            },
          ],
        };
      }

      // load notes if we havent
      if (!LOADED_NOTES) {
        const resp = await server.sendIDLRequest(
          id,
          MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS,
          {},
        );

        // try to load based on the response
        if (resp.success) {
          ENVI_TOOL_WORKFLOW_REGISTRY.addManyToolWorkflows(resp.workflows);
          LOADED_NOTES = true;
        } else {
          LOAD_FAILURE = resp.err;
          return {
            isError: true,
            content: [{ type: 'text', text: JSON.stringify(resp) }],
          };
        }
      }

      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              ENVI_TOOL_WORKFLOW_REGISTRY.getWorkflowNames(),
            ),
          },
        ],
      };
    },
  );
}
