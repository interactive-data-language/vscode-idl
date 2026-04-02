import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { ADD_DATA_TO_MAP_DESCRIPTION } from './register-mcp-tool-add-data-to-map.interface';

/**
 * Registers the add-data-to-map MCP tool.
 *
 * The tool delegates to the VSCode side (via sendIDLRequest) which runs IDL
 * code to load the data, calls IDLNotebook.Export, and returns the structured
 * IDLNotebookEmbeddedItem<IDLNotebookMap> payload.
 */
export function RegisterMCPTool_AddDataToMap(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.ADD_DATA_TO_MAP,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.ADD_DATA_TO_MAP],
      description: ADD_DATA_TO_MAP_DESCRIPTION,
      inputSchema: {
        layerType: z
          .enum(['geojson', 'raster', 'vector'])
          .describe(
            'Type of layer to add. Use "geojson" when providing an inline GeoJSON string, ' +
              '"raster" for a georeferenced image file, and "vector" for a vector/shapefile.',
          ),
        uri: z
          .string()
          .optional()
          .describe(
            'Fully-qualified path to a raster or vector file on disk. ' +
              'Required when layerType is "raster" or "vector".',
          ),
        geojson: z
          .string()
          .optional()
          .describe(
            'Raw GeoJSON string to display. Required when layerType is "geojson".',
          ),
        layerName: z
          .string()
          .optional()
          .describe('Optional human-readable display name for the layer.'),
      },
    },
    async (id, { layerType, uri, geojson, layerName }) => {
      const resp = await server.sendIDLRequest(
        id,
        MCP_TOOL_LOOKUP.ADD_DATA_TO_MAP,
        { layerType, uri, geojson, layerName },
      );

      return {
        isError: !resp.success,
        content: [
          {
            type: 'text',
            text: JSON.stringify(resp),
          },
        ],
      };
    },
  );
}
