import {
  MCP_TOOL_LOOKUP,
  MCPTool_ENVIRunTask,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { PROMPT } from '../../helpers/mcp-envi-tasks.interface';
import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/** BY task name, what is the file for the task we want to run? For user tasks in workspaces in VSCode */
export const TASK_FILE_LOOKUP: { [key: string]: string } = {};

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterMCPTool_ENVIRunTask(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.tool(
    MCP_TOOL_LOOKUP.ENVI_RUN_TASK,
    `Runs an ENVI task given the input parameters The input parameters should *ALWAYS* match the schema from ${MCP_TOOL_LOOKUP.ENVI_LIST_TASKS}. Here's the process to get the input parameters:\n\n ${PROMPT}`,
    {
      taskName: z
        .string()
        .describe('Specify the name of the ENVI Task that will run'),
      inputParameters: z
        .object({})
        .catchall(z.any())
        .describe(
          `Specify a JSON object containing the task parameters that matches the JSON schema returned from the tool ${MCP_TOOL_LOOKUP.ENVI_LIST_TASKS}`
        ),
    },
    async (id, inputParameters) => {
      // strictly typed parameters and make sure we always have content in the cells
      const params: MCPToolParams<MCPTool_ENVIRunTask> = {
        taskName: inputParameters.taskName,
        inputParameters: inputParameters.inputParameters,
      };

      console.log(inputParameters);

      // check if we have a task file to use instead
      if (inputParameters.taskName in TASK_FILE_LOOKUP) {
        params.taskName = TASK_FILE_LOOKUP[inputParameters.taskName];
      }

      const resp = (await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.ENVI_RUN_TASK,
          params,
        }
      )) as MCPToolResponse<MCPTool_ENVIRunTask>;

      return {
        content: [
          {
            type: 'text',
            text: `Tool execution status: ${JSON.stringify(resp)}`,
          },
          {
            type: 'text',
            text: `Task outputs: ${JSON.stringify(resp.outputParameters)}`,
          },
        ],
      };
    }
  );
}
