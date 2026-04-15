import {
  MCP_ENVIDeepLearningONNXModel,
  MCP_ENVIMachineLearningModel,
  MCP_ENVIRaster,
  MCP_ENVIROI,
  MCP_ENVISpectralLibrary,
  MCP_ENVIVector,
} from '@idl/mcp/envi-to-mcp';
import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-install-message.interface';
import { QUERY_DATASET_WITH_ENVI_DESCRIPTION } from './register-mcp-tool-query-dataset-with-envi.interface';

/**
 * Registers a tool that allows an agent to get additional information about a dataset
 */
export function RegisterMCPTool_QueryDatasetWithENVI(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI
        ],
      description: QUERY_DATASET_WITH_ENVI_DESCRIPTION,
      inputSchema: {
        raster: MCP_ENVIRaster()
          .optional()
          .describe('An ENVI Raster to query (e.g. .dat, .tif, .img).'),
        vector: MCP_ENVIVector()
          .optional()
          .describe('An ENVI vector file (shapefile, .shp) to query.'),
        roi: MCP_ENVIROI()
          .optional()
          .describe('An ENVI ROI file (.xml) to query.'),
        spectralLibrary: MCP_ENVISpectralLibrary()
          .optional()
          .describe('An ENVI spectral library (.sli) to query.'),
        deepLearningModel: MCP_ENVIDeepLearningONNXModel()
          .optional()
          .describe('An ENVI Deep Learning ONNX model (.envi.onnx) to query.'),
        machineLearningModel: MCP_ENVIMachineLearningModel()
          .optional()
          .describe('An ENVI Machine Learning model (.json) to query.'),
      },
    },
    async (
      id,
      {
        raster,
        vector,
        roi,
        spectralLibrary,
        deepLearningModel,
        machineLearningModel,
      },
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

      // pick the dataset that was provided
      const dataset =
        raster ??
        vector ??
        roi ??
        spectralLibrary ??
        deepLearningModel ??
        machineLearningModel;

      // make sure one was passed in
      if (!dataset) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: 'No dataset provided. Specify exactly one of: raster, vector, roi, spectralLibrary, deepLearningModel, or machineLearningModel.',
            },
          ],
        };
      }

      const resp = await server.sendIDLRequest(
        id,
        MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI,
        {
          dataset,
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
