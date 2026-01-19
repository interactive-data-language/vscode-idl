import {
  MCPTaskRegistry,
  TaskLocation,
  TaskLocation_File,
} from '@idl/mcp/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_ENVIRunTool,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';
import { ENVI_TASK_INSTRUCTIONS } from './envi-task-instructions.interface';

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterMCPTool_ENVIRunTool(
  messenger: VSCodeLanguageServerMessenger,
  registry: MCPTaskRegistry
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.ENVI_RUN_TOOL,
    IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.ENVI_RUN_TOOL],
    `Runs an ENVI Tool given the input parameters The input parameters should *ALWAYS* match the schema from the tool ${MCP_TOOL_LOOKUP.ENVI_LIST_TOOLS}. Here's the process to get the input parameters:\n\n ${ENVI_TASK_INSTRUCTIONS}`,
    {
      taskName: z
        .string()
        .describe('Specify the name of the ENVI Task that will run'),
      inputParameters: z
        .object({})
        .catchall(z.any())
        .describe(
          `Specify a JSON object containing the task parameters that matches the JSON schema returned from the tool ${MCP_TOOL_LOOKUP.ENVI_LIST_TOOLS}`
        ),
      interactive: z
        .boolean()
        .default(false)
        .describe(
          `If true, the tool will appear in the ENVI UI and the user can fine-tune/tweak parameters. Only do this when requrested.`
        ),
    },
    async (id, { taskName, inputParameters, interactive }) => {
      if (!registry.hasTask(taskName)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `ENVI Tool with name '${taskName}' is not known, did it come from the tool ${MCP_TOOL_LOOKUP.ENVI_LIST_TOOLS}?`,
            },
          ],
        };
      }

      // validate the parameters
      const isValid = registry.validateInputParameters(
        taskName,
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
      const detail = registry.getTaskDetail(taskName);

      // strictly typed parameters and make sure we always have content in the cells
      const params: MCPToolParams<MCPTool_ENVIRunTool> = {
        interactive,
        task: {
          taskName,
          inputParameters,
        },
      };

      // check if we have a task file to use instead
      if (detail.location) {
        if (detail.location.type === 'file') {
          params.task.taskName = (
            detail.location as TaskLocation<TaskLocation_File>
          ).meta.path;
        }
      }

      const resp = (await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.ENVI_RUN_TOOL,
          params,
        }
      )) as MCPToolResponse<MCPTool_ENVIRunTool>;

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
