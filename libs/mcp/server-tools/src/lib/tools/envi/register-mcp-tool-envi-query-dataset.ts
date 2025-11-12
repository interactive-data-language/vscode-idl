import {
  MCP_TOOL_LOOKUP,
  MCPTool_ENVIQueryDataset,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPENVIDeepLearningONNXModel } from '../../helpers/envi-parameters/types/mcp-envi-deep-learning-onnx-model';
import { MCPENVIMachineLearningModel } from '../../helpers/envi-parameters/types/mcp-envi-machine-learning-model';
import { MCPENVIRaster } from '../../helpers/envi-parameters/types/mcp-envi-raster';
import { MCPENVIROI } from '../../helpers/envi-parameters/types/mcp-envi-roi';
import { MCPENVISpectralLibrary } from '../../helpers/envi-parameters/types/mcp-envi-spectral-library';
import { MCPENVIVector } from '../../helpers/envi-parameters/types/mcp-envi-vector';
import { MCPToolRegistry } from '../../mcp-tool-registry.class';
import { ENVI_QUERY_DATASET_DESCRIPTION } from './register-mcp-tool-envi-query-dataset.interface';

/**
 * Registers a tool that allows an agent to get additional information about a dataset
 */
export function RegisterMCPTool_ENVIQueryDataset(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.ENVI_QUERY_DATASET,
    ENVI_QUERY_DATASET_DESCRIPTION,
    {
      dataset: z
        .union([
          MCPENVIDeepLearningONNXModel('An ONNX model configured for ENVI'),
          MCPENVIMachineLearningModel(
            'An machine learning model (i.e. random forest) made with ENVI'
          ),
          MCPENVIRaster('An ENVI Raster'),
          MCPENVIROI('An ENVI ROI'),
          MCPENVISpectralLibrary('An ENVI spectral library'),
          MCPENVIVector('An ENVI vector file (shapefile)'),
        ])
        .describe('The dataset that you want to query, one of the above types'),
    },
    async (id, { dataset }) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_ENVIQueryDataset> = {
        dataset,
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.ENVI_QUERY_DATASET,
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
