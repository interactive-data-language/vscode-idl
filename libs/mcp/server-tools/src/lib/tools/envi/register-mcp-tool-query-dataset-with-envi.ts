import {
  MCP_ENVIDeepLearningONNXModel,
  MCP_ENVIMachineLearningModel,
  MCP_ENVIRaster,
  MCP_ENVIROI,
  MCP_ENVISpectralLibrary,
  MCP_ENVIVector,
} from '@idl/mcp/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_QueryDatasetWithENVI,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';
import { QUERY_DATASET_WITH_ENVI_DESCRIPTION } from './register-mcp-tool-query-dataset-with-envi.interface';

/**
 * Registers a tool that allows an agent to get additional information about a dataset
 */
export function RegisterMCPTool_QueryDatasetWithENVI(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI,
    IDL_TRANSLATION.mcp.tools.displayNames[
      MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI
    ],
    QUERY_DATASET_WITH_ENVI_DESCRIPTION,
    {
      dataset: z
        .union([
          MCP_ENVIDeepLearningONNXModel('An ONNX model configured for ENVI'),
          MCP_ENVIMachineLearningModel(
            'An machine learning model (i.e. random forest) made with ENVI'
          ),
          MCP_ENVIRaster('An ENVI Raster'),
          MCP_ENVIROI('An ENVI ROI'),
          MCP_ENVISpectralLibrary('An ENVI spectral library'),
          MCP_ENVIVector('An ENVI vector file (shapefile)'),
        ])
        .describe('The dataset that you want to query, one of the above types'),
    },
    async (id, { dataset }) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_QueryDatasetWithENVI> = {
        dataset,
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI,
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
