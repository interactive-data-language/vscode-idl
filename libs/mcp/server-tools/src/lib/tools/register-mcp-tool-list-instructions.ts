import { MCPInstructionRegistry } from '@idl/mcp/instructions';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

import { MCPToolHelper } from '../mcp-tool-helper.class';
import { GET_INSTRUCTIONS_INSTRUCTIONS } from './get-instructions-instructions.interface';

/**
 * List available instruction sets for LLM consumption
 */
export function RegisterMCPTool_ListInstructions(
  helper: MCPToolHelper,
  registry: MCPInstructionRegistry
) {
  helper.registerTool(
    MCP_TOOL_LOOKUP.LIST_INSTRUCTIONS,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.LIST_INSTRUCTIONS
        ],
      description: `Lists the names and descriptions of known instruction sets. See these rules for how to use:\n\n${GET_INSTRUCTIONS_INSTRUCTIONS}`,
      inputSchema: {},
    },
    async (id) => {
      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: JSON.stringify(registry.allDescriptions()),
          },
        ],
      };
    }
  );
}
