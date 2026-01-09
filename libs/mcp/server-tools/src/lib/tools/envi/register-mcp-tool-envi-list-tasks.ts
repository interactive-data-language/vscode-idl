import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';
import { ENVI_TASK_INSTRUCTIONS } from './envi-task-instructions.interface';

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterMCPTool_ENVIListTasks(
  messenger: VSCodeLanguageServerMessenger,
  registry: MCPTaskRegistry
) {
  // register tool
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.ENVI_LIST_TASKS,
    IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.ENVI_LIST_TASKS],
    `Lists all image processing and spectral analysis tools that ENVI has available. Here's the process to get the list of ENVI Tools and how to use them:\n\n ${ENVI_TASK_INSTRUCTIONS}`,
    {},
    async (id, inputParameters) => {
      return {
        content: [
          {
            type: 'text',
            text: `Names and descriptions of ENVI Tools that you can run: ${JSON.stringify(
              registry.getDescriptions()
            )}`,
          },
        ],
      };
    }
  );
}
