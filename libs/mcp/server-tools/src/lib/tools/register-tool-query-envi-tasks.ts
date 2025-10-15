import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { PROMPT } from '../helpers/mcp-envi-tasks.interface';
import { MCPToolRegistry } from '../mcp-tool-registry.class';

/**
 * A string lookup of our ENVI tasks to return to the agent
 */
export const TASK_LOOKUP: { [key: string]: string } = {};

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterToolQueryENVITasks(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.tool(
    MCP_TOOL_LOOKUP.QUERY_ENVI_TASKS,
    `Returns available image processing and spectral analysis tools that ENVI has available. The tools map to ENVI Tasks that have discrete inputs and outputs. Here's the process to get the list of ENVI Tasks and how to use them:\n\n ${PROMPT}`,
    {},
    async (id, inputParameters) => {
      return {
        content: [
          {
            type: 'text',
            text: `Names and descriptions of ENVI Tasks that you can run: ${JSON.stringify(
              TASK_LOOKUP
            )}`,
          },
        ],
      };
    }
  );
}
