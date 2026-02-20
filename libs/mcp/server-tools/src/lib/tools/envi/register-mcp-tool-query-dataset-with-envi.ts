import {
  MCP_ENVIDeepLearningONNXModel,
  MCP_ENVIMachineLearningModel,
  MCP_ENVIRaster,
  MCP_ENVIROI,
  MCP_ENVISpectralLibrary,
  MCP_ENVIVector,
} from '@idl/mcp/envi-to-mcp';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { MCPToolHelper } from '../../mcp-tool-helper.class';
import { IS_ENVI_INSTALLED } from '../../register-all-mcp-tools';
import { ENVI_INSTALL_MESSAGE } from './envi-install-message.interface';
import { QUERY_DATASET_WITH_ENVI_DESCRIPTION } from './register-mcp-tool-query-dataset-with-envi.interface';

/**
 * Registers a tool that allows an agent to get additional information about a dataset
 */
export function RegisterMCPTool_QueryDatasetWithENVI(helper: MCPToolHelper) {
  helper.registerTool(
    MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI
        ],
      description: QUERY_DATASET_WITH_ENVI_DESCRIPTION,
      inputSchema: {
        dataset: z
          .union([
            MCP_ENVIDeepLearningONNXModel().describe(
              'An ENVI Deep Learning ONNX model to query'
            ),
            MCP_ENVIMachineLearningModel().describe(
              'An ENVI Machine learning model to query'
            ),
            MCP_ENVIRaster().describe('An ENVI Raster to query'),
            MCP_ENVIROI().describe('An ENVI ROI to query'),
            MCP_ENVISpectralLibrary().describe(
              'An ENVI spectral library to query'
            ),
            MCP_ENVIVector().describe(
              'An ENVI vector file (shapefile) to query'
            ),
          ])
          .describe(
            'The dataset that you want to query, one of the above types'
          ),
      },
    },
    async (id, { dataset }) => {
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

      const resp = await helper.sendRequestToVSCode(
        id,
        MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI,
        {
          dataset,
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
