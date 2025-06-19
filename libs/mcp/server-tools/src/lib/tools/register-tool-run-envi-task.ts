import {
  MCP_TOOL_LOOKUP,
  MCPTool_RunENVITask,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { PROMPT } from '../helpers/mcp-envi-tasks.interface';
import { MCPToolRegistry } from '../mcp-tool-registry.class';

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterToolRunENVITask(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.tool(
    MCP_TOOL_LOOKUP.RUN_ENVI_TASK,
    `Runs an ENVI task given the input parameters The input parameters should *ALWAYS* match the schema from ${MCP_TOOL_LOOKUP.QUERY_ENVI_TASKS}. Here's the process to get the input parameters:\n\n ${PROMPT}`,
    {
      taskName: z
        .string()
        .describe('Specify the name of the ENVI Task that will run'),
      inputParameters: z
        .object({})
        .catchall(z.any())
        .describe(
          `Specify a JSON object containing the task parameters that matches the JSON schema returned from the tool ${MCP_TOOL_LOOKUP.QUERY_ENVI_TASKS}`
        ),
    },
    async (id, inputParameters) => {
      // strictly typed parameters and make sure we always have content in the cells
      const params: MCPToolParams<MCPTool_RunENVITask> = {
        taskName: inputParameters.taskName,
        inputParameters: inputParameters.inputParameters,
      };

      console.log(inputParameters);

      const resp = (await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.RUN_ENVI_TASK,
          params,
        }
      )) as MCPToolResponse<MCPTool_RunENVITask>;

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
