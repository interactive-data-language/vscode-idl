import {
  MCP_ENVIRaster,
  MCP_ENVIRasterSeries,
  MCP_ENVIVector,
} from '@idl/mcp/envi-to-mcp';
import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-install-message.interface';

/** Shared order field added to each dataset item */
const ORDER_FIELD = z
  .number()
  .int()
  .optional()
  .describe(
    'Controls the stacking position of this item in the ENVI view. Lower numbers are placed at the bottom (displayed first). If omitted, items are stacked rasters first, then raster series, then vectors, each in the order they appear in their respective array.',
  );

/**
 * Registers a tool that allows us to open an image in ENVI
 */
export function RegisterMCPTool_OpenDatasetsInENVI(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI
        ],
      description:
        'Open one or more raster, raster series, or vector datasets in ENVI and display. The view in ENVI will be centered on the extent of all open datasets after loading. Provide datasets via the typed arrays (rasters, rasterSeries, vectors). Use the "order" field on each item to control stacking — lower numbers are rendered at the bottom.',
      inputSchema: {
        rasters: z
          .array(MCP_ENVIRaster().extend({ order: ORDER_FIELD }))
          .optional()
          .describe('Rasters to open'),
        rasterSeries: z
          .array(MCP_ENVIRasterSeries().extend({ order: ORDER_FIELD }))
          .optional()
          .describe('ENVI Raster Series files to open'),
        vectors: z
          .array(MCP_ENVIVector().extend({ order: ORDER_FIELD }))
          .optional()
          .describe('Vector files to open.'),
        automaticZoom: z
          .enum(['all-layers', 'last-layer', 'none'])
          .default('last-layer')
          .describe(
            'Automatic zoom strategy when we add a layer. "all-layers" uses the extent of all displayed layers. "last-layer" zooms to the last layer added. "none" means no automatic zooming.',
          ),
        resetView: z
          .boolean()
          .default(false)
          .describe(
            'If true, the ENVI view is reset and all datasets are removed before displaying datasets. Recommended to set this the first time you call this tool.',
          ),
      },
    },
    async (
      id,
      { rasters, rasterSeries, vectors, resetView, automaticZoom },
    ) => {
      // make sure ENVI is installed
      if (!IS_ENVI_INSTALLED) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: ENVI_INSTALL_MESSAGE,
            },
          ],
        };
      }

      // Merge all dataset arrays, resolve stacking order, strip the 'order' field
      let autoIdx = 0;
      const tagged: Array<[number, any]> = [];

      // add raster
      for (const item of rasters ?? []) {
        const { order, ...rest } = item;
        tagged.push([order ?? autoIdx++, rest]);
      }

      // add raster series
      for (const item of rasterSeries ?? []) {
        const { order, ...rest } = item;
        tagged.push([order ?? autoIdx++, rest]);
      }

      // add vector
      for (const item of vectors ?? []) {
        const { order, ...rest } = item;
        tagged.push([order ?? autoIdx++, rest]);
      }

      // sort by layers
      tagged.sort((a, b) => a[0] - b[0]);

      // extract datasets
      const datasets = tagged.map(([, item]) => item);

      const resp = await server.sendIDLRequest(
        id,
        MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI,
        {
          datasets,
          resetView,
          automaticZoom,
        },
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
