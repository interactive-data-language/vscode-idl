import {
  defineTool,
  type Tool,
  type ToolResultObject,
} from '@github/copilot-sdk';

import type { CopilotMCPToolsets } from '../mcp-toolsets.class';
import {
  LOAD_TOOLSET_NAME,
  LOAD_TOOLSET_PARAMETERS,
  MCP_TOOLSET_NAMES,
  MCP_TOOLSETS,
} from '../mcp-toolsets.interface';

/** Create the conversation-local loader for deferred MCP tool schemas. */
export function RegisterMCPTool_LoadToolset(
  toolsets: CopilotMCPToolsets,
  updateTools: (availableTools: string[]) => Promise<void>,
): Tool {
  return defineTool(LOAD_TOOLSET_NAME, {
    description: [
      'Load additional MCP tools for this conversation before using their capabilities. Core tools are already available. Loading does not run the tools.',
      ...MCP_TOOLSET_NAMES.map(
        (name) => `${name}: ${MCP_TOOLSETS[name].description}`,
      ),
    ].join('\n'),
    parameters: LOAD_TOOLSET_PARAMETERS,
    skipPermission: true,
    handler: async ({ toolset }): Promise<ToolResultObject> => {
      try {
        const result = await toolsets.load(toolset, updateTools);
        return {
          resultType: 'success',
          textResultForLlm: JSON.stringify(result),
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[CopilotChatService] Error loading toolset:', error);
        return {
          resultType: 'failure',
          error: message,
          textResultForLlm: `Failed to load toolset "${toolset}": ${message}`,
        };
      }
    },
  });
}
