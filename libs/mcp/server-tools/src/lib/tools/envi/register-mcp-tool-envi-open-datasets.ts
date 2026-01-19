import {
  MCP_ENVIRaster,
  MCP_ENVIRasterSeries,
  MCP_ENVIVector,
} from '@idl/mcp/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_ENVIOpenDatasets,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/**
 * Registers a tool that allows us to open an image in ENVI
 */
export function RegisterMCPTool_ENVIOpenDatasets(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.ENVI_OPEN_DATASETS,
    IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.ENVI_OPEN_DATASETS],
    'Open one or more raster, raster series, or vector datasets in ENVI and display. The view in ENVI will be centered on the extend of all open datasets after loading.',
    {
      datasets: z
        .array(
          z.union([
            MCP_ENVIRaster('An ENVI Raster'),
            MCP_ENVIVector('An ENVI vector file (shapefile)'),
            MCP_ENVIRasterSeries('An ENVI Raster series file'),
          ])
        )
        .describe('The datasets to open in ENVI.'),
      automaticZoom: z
        .enum(['all-layers', 'last-layer', 'none'])
        .default('last-layer')
        .describe(
          'Automatic zoom strategy when we add a layer. "all-layers" uses the extent of all displayed layers. "last-layer" zooms to the last layer added. "none" means no automatic zooming.'
        ),
      resetView: z
        .boolean()
        .default(false)
        .describe(
          'If true, the ENVI view is reset and all datasets are removed before displaying datasets.'
        ),
    },
    async (id, { datasets, resetView, automaticZoom }) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_ENVIOpenDatasets> = {
        datasets,
        resetView,
        automaticZoom,
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.ENVI_OPEN_DATASETS,
          params,
        }
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
    }
  );
}
