import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { existsSync, mkdirSync } from 'fs';
import { z } from 'zod';

/**
 * Registers Create Folder tool
 */
export function RegisterMCPTool_CreateFolder(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.CREATE_FOLDER,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.CREATE_FOLDER],
      description:
        'Creates a folder at the specified fully qualified path recursively.',
      inputSchema: {
        folder: z
          .string()
          .describe('The fully qualified path of the folder to create'),
      },
    },
    async (id, { folder }) => {
      try {
        if (existsSync(folder)) {
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: `Folder already exists: ${folder}`,
              },
            ],
          };
        }

        // Recursively create the directories
        mkdirSync(folder, { recursive: true });

        return {
          isError: false,
          content: [
            {
              type: 'text',
              text: `Successfully created folder: ${folder}`,
            },
          ],
        };
      } catch (error: any) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Failed to create folder: ${error?.message || error}`,
            },
          ],
        };
      }
    },
  );
}
