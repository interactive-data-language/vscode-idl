import {
  MCPTaskRegistry,
  TaskLocation,
  TaskLocation_File,
} from '@idl/mcp/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_RunENVITool,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { z } from 'zod';

import { MCPToolHelper } from '../../mcp-tool-helper.class';
import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-install-message.interface';
import { ENVI_TOOL_INSTRUCTIONS } from './envi-tool-instructions.interface';

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterMCPTool_RunENVITool(
  helper: MCPToolHelper,
  registry: MCPTaskRegistry
) {
  helper.registerTool(
    MCP_TOOL_LOOKUP.RUN_ENVI_TOOL,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.RUN_ENVI_TOOL],
      description: `Runs an ENVI Tool given the input parameters The input parameters should *ALWAYS* match the schema from the tool "${MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS}". Here's the process to get the input parameters:\n\n ${ENVI_TOOL_INSTRUCTIONS}`,
      inputSchema: {
        toolName: z
          .string()
          .describe('Specify the name of the ENVI Task that will run'),
        inputParameters: z
          .object({})
          .catchall(z.any())
          .describe(
            `Specify a JSON object containing the task parameters that matches the JSON schema returned from the tool "${MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS}"`
          ),
        interactive: z
          .boolean()
          .default(false)
          .describe(
            `If true, the tool will appear in the ENVI UI and the user can fine-tune/tweak parameters. Only do this when requested.`
          ),
      },
    },
    async (id, { toolName, inputParameters, interactive }) => {
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

      if (!registry.hasTask(toolName)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `ENVI Tool with name "${toolName}" is not known, did it come from the tool "${MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS}"?`,
            },
          ],
        };
      }

      // validate the parameters
      const isValid = registry.validateInputParameters(
        toolName,
        inputParameters
      );

      // report error
      if (!isValid.success) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text:
                isValid.reason ||
                'MCP Error -32602: Input parameters failed validation',
            },
          ],
        };
      }

      /** Get detail for our task */
      const detail = registry.getTaskDetail(toolName);

      // strictly typed parameters and make sure we always have content in the cells
      const params: MCPToolParams<MCPTool_RunENVITool> = {
        interactive,
        toolName,
        inputParameters,
      };

      // check if we have a task file to use instead
      if (detail.location) {
        if (detail.location.type === 'file') {
          params.uri = (
            detail.location as TaskLocation<TaskLocation_File>
          ).meta.path;
        }
      }

      const resp = (await helper.sendRequestToVSCode(
        id,
        MCP_TOOL_LOOKUP.RUN_ENVI_TOOL,
        params
      )) as MCPToolResponse<MCPTool_RunENVITool>;

      // sanitize the output parameters
      registry.sanitizeOutputParameters(resp.outputParameters);

      return {
        isError: !resp.success,
        content: [
          {
            type: 'text',
            text: JSON.stringify(resp),
          },
          // {
          //   type: 'text',
          //   text: `Tool execution status: ${JSON.stringify(resp)}`,
          // },
          // {
          //   type: 'text',
          //   text: `Task outputs: ${JSON.stringify(resp.outputParameters)}`,
          // },
        ],
      };
    }
  );
}
