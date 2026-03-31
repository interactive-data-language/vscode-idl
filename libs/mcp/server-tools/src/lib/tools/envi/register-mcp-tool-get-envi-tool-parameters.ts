import { MCPServer } from '@idl/mcp/server';
import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-install-message.interface';
import { ENVI_TOOL_INSTRUCTIONS } from './envi-tool-instructions.interface';

/**
 * Track if we have loaded notes or not
 */
let LOADED_NOTES = false;

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterMCPTool_GetENVIToolParameters(
  server: MCPServer,
  registry: MCPTaskRegistry,
) {
  server.registerTool(
    MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS
        ],
      description: `Returns the parameters required to run an ENVI Tool. This should *ALWAYS* be used before ${MCP_TOOL_LOOKUP.RUN_ENVI_TOOL}. Here's the process to use these input parameters:\n\n ${ENVI_TOOL_INSTRUCTIONS}`,
      inputSchema: {
        toolName: z
          .string()
          .describe('Specify an ENVI Task to return the parameter schema for'),
      },
    },
    async (id, { toolName }) => {
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

      // make sure we have the requested task
      if (!registry.hasTask(toolName)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Task with name "${toolName}" is not known, did it come from the tool "${MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS}"?`,
            },
          ],
        };
      }

      // load notes if we havent yet
      if (!LOADED_NOTES) {
        const resp = await server.sendIDLRequest(
          id,
          MCP_TOOL_LOOKUP.RETURN_NOTES,
          {},
        );

        // mark as loaded, even if we have an error
        LOADED_NOTES = true;

        // try to load based on the response
        if (resp.success) {
          registry.addNotesForManyTasks(resp.notes.envi);
        }
      }

      /** Get detail for our task */
      const detail = registry.getTaskDetail(toolName);

      // create content
      const content = [
        {
          type: 'text',
          text: JSON.stringify(detail.inputParameters),
        },
        {
          type: 'text',
          text: JSON.stringify(detail.outputParameters),
        },
      ];

      // check for notes
      if (Array.isArray(detail.notes)) {
        content.push({
          type: 'text',
          text: `Additional notes: ${JSON.stringify(detail.notes)}`,
        });
      }

      // override type, gets mad with the extra push
      return {
        isError: false,
        content: content as any,
      };
    },
  );
}
