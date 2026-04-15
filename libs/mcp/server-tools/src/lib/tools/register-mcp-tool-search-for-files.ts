import { FindFiles, IFolderRecursion } from '@idl/idl/files';
import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { existsSync } from 'fs';
import { z } from 'zod';

/**
 * Search through registered resources
 */
export function RegisterMCPTool_SearchForFiles(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.SEARCH_FOR_FILES,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.SEARCH_FOR_FILES
        ],
      description: `Searches a location for files. By default reads a folder and returns all files in a location. You can optionally specify file extensions to search for`,
      inputSchema: {
        folder: z
          .string()
          .describe(
            'The fully qualified path to a location to search for files',
          ),
        extensions: z
          .array(z.string())
          .default(['*'])
          .describe(
            'Specify one or more file extensions to search for. Asterisk indicates all files are returned (recommended).',
          ),
        recursive: z
          .boolean()
          .default(true)
          .describe(
            'Do we recursively search? Default is to search recursively.',
          ),
      },
    },
    async (id, { folder, extensions, recursive }) => {
      /**
       * Make sure folder exists
       */
      if (!existsSync(folder)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Specified folder to search does not exist. Check path and try again.`,
            },
          ],
        };
      }

      /**
       * Map extensions to recursive glob patterns
       */
      const useExtensions =
        extensions.findIndex((val) => val === '*') !== -1
          ? [`**/*`]
          : extensions.map((ext) => `**/*${ext}`);

      /** Init results */
      let results: string[] = [];

      /** Create search parameters */
      const folders: IFolderRecursion = {};
      folders[folder] = recursive;

      // search for each extension
      for (let i = 0; i < useExtensions.length; i++) {
        results = results.concat(await FindFiles(folders, useExtensions[i]));
      }

      // return
      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: JSON.stringify(results),
          },
        ],
      };
    },
  );
}
