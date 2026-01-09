import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';
import { ENVI_TASK_INSTRUCTIONS } from './envi-task-instructions.interface';

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterMCPTool_ENVIGetTaskParameters(
  messenger: VSCodeLanguageServerMessenger,
  registry: MCPTaskRegistry
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.ENVI_GET_TASK_PARAMETERS,
    IDL_TRANSLATION.mcp.tools.displayNames[
      MCP_TOOL_LOOKUP.ENVI_GET_TASK_PARAMETERS
    ],
    `Returns the parameters required to run an ENVI Tool. This should *ALWAYS* be used before ${MCP_TOOL_LOOKUP.ENVI_RUN_TASK}. Here's the process to use these input parameters:\n\n ${ENVI_TASK_INSTRUCTIONS}`,
    {
      taskName: z
        .string()
        .describe('Specify an ENVI Task to return the parameter schema for'),
    },
    async (id, inputParameters) => {
      if (!registry.hasTask(inputParameters.taskName)) {
        return {
          content: [
            {
              type: 'text',
              text: `Task with name ${inputParameters.taskName} is not known, did it come from the tool ${MCP_TOOL_LOOKUP.ENVI_LIST_TASKS}?`,
            },
          ],
        };
      }

      /** Get detail for our task */
      const detail = registry.getTaskDetail(inputParameters.taskName);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(detail.inputParameters),
          },
          {
            type: 'text',
            text: JSON.stringify(detail.outputParameters),
          },
        ],
      };
    }
  );
}
