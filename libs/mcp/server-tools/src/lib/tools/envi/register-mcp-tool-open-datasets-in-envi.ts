import {
  MCP_ENVIRaster,
  MCP_ENVIRasterSeries,
  MCP_ENVIVector,
} from '@idl/mcp/envi-to-mcp';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_OpenDatasetsInENVI,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';
import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-intall-message.interface';

/**
 * Registers a tool that allows us to open an image in ENVI
 */
export function RegisterMCPTool_OpenDatasetsInENVI(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI
        ],
      description:
        'Open one or more raster, raster series, or vector datasets in ENVI and display. The view in ENVI will be centered on the extend of all open datasets after loading.',
      inputSchema: {
        datasets: z
          .array(
            z.union([
              MCP_ENVIRaster().describe('An ENVI Raster'),
              MCP_ENVIVector().describe('An ENVI vector file (shapefile)'),
              MCP_ENVIRasterSeries().describe('An ENVI Raster series file'),
            ])
          )
          .describe(
            'The datasets to open in ENVI. The order of the array is the order in which items are displayed in ENVI, so the first item is the bottom-most layer.'
          ),
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
    },
    async (id, { datasets, resetView, automaticZoom }) => {
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

      // strictly typed parameters
      const params: MCPToolParams<MCPTool_OpenDatasetsInENVI> = {
        datasets,
        resetView,
        automaticZoom,
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI,
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
