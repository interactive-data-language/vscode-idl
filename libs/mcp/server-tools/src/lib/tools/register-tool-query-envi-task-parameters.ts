import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { PROMPT } from '../helpers/mcp-envi-tasks.interface';
import { MCPToolRegistry } from '../mcp-tool-registry.class';

/**
 * A string lookup of our ENVI tasks to return to the agent
 */
export const PARAMETER_LOOKUP: { [key: string]: any } = {};

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterToolQueryENVITaskParameters(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.tool(
    MCP_TOOL_LOOKUP.QUERY_ENVI_TASK_PARAMETERS,
    `Returns the JSON schema for the input parameters for a given ENVI Task. This should *ALWAYS* be used before ${MCP_TOOL_LOOKUP.RUN_ENVI_TASK}. Here's the process to use these input parameters:\n\n ${PROMPT}`,
    {
      taskName: z
        .string()
        .describe('Specify an ENVI Task to return the parameter schema for'),
    },
    async (id, inputParameters) => {
      if (!(inputParameters.taskName in PARAMETER_LOOKUP)) {
        return {
          content: [
            {
              type: 'text',
              text: `Task with name ${inputParameters.taskName} is not known, is the case right and did it come from the tool ${MCP_TOOL_LOOKUP.QUERY_ENVI_TASKS}?`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(PARAMETER_LOOKUP[inputParameters.taskName]),
          },
        ],
      };
    }
  );
}
