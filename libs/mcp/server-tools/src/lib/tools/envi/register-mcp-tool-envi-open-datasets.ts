import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_ENVIOpenDatasets,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPENVIRaster } from '../../helpers/envi-parameters/types/mcp-envi-raster';
import { MCPENVIRasterSeries } from '../../helpers/envi-parameters/types/mcp-envi-raster-series';
import { MCPENVIVector } from '../../helpers/envi-parameters/types/mcp-envi-vector';
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
            MCPENVIRaster('An ENVI Raster'),
            MCPENVIVector('An ENVI vector file (shapefile)'),
            MCPENVIRasterSeries('An ENVI Raster series file'),
          ])
        )
        .describe('The datasets to open in ENVI.'),
      resetView: z
        .boolean()
        .default(false)
        .describe(
          'If true, the ENVI view is reset and all datasets are removed before displaying datasets.'
        ),
    },
    async (id, { datasets, resetView }) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_ENVIOpenDatasets> = {
        datasets: JSON.stringify(datasets),
        resetView,
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
        content: [
          {
            type: 'text',
            text: `Tool execution status: ${JSON.stringify(resp)}`,
          },
        ],
      };
    }
  );
}
