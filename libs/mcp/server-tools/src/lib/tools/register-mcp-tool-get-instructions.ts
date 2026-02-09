import { MCPInstructionRegistry } from '@idl/mcp/instructions';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../mcp-tool-registry.class';

/**
 * Get instruction set content
 */
export function RegisterMCPTool_GetInstructions(
  messenger: VSCodeLanguageServerMessenger,
  registry: MCPInstructionRegistry
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.GET_INSTRUCTIONS,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.GET_INSTRUCTIONS
        ],
      description: `Returns the an instruction set based on the name. The name should come from "${MCP_TOOL_LOOKUP.LIST_INSTRUCTIONS}".`,
      inputSchema: {
        name: z
          .string()
          .describe('The name of the instruction set to retrieve'),
      },
    },
    async (id, { name }) => {
      // check for invalid ID
      if (!registry.hasInstruction(name)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Unknown instruction name of "${name}"`,
            },
          ],
        };
      }

      // make sure user didnt delete the file
      if (!registry.instructionsExist(name)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Instruction file for "${name}" is missing. Likely deleted by user after startup.`,
            },
          ],
        };
      }

      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: registry.getInstruction(name),
          },
        ],
      };
    }
  );
}
