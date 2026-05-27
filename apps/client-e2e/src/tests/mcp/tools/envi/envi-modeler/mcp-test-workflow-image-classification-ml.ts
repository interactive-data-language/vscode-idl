import {
  ENVIModelerNode,
  MCP_TOOL_LOOKUP,
  MCPTool_CreateENVIModelerWorkflow,
} from '@idl/types/mcp';
import expect from 'expect';
import { existsSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { LogWhenExpectSuccess } from '../../../helpers/test-loggers';

/**
 * Test creating an image classification ML workflow
 */
export const RunMCPTestWorkflowImageClassificationML: RunnerFunction = async (
  _init,
) => {
  const nodes: ENVIModelerNode[] = [
    {
      id: 'inputs',
      type: 'inputparameters',
      parameters: [
        {
          name: 'input_raster',
          display_name: 'Input Raster',
          description: 'Raster to classify into thematic categories',
          type: 'ENVIRaster',
        },
        {
          name: 'training_roi',
          display_name: 'Training ROIs',
          description:
            'ENVI ROI file with labeled training samples for each class',
          type: 'ENVIROIArray',
        },
      ],
    },
    {
      id: 'normstats',
      type: 'task',
      task_name: 'NormalizationStatistics',
      comment: 'Calculate min/max normalization statistics from the raster',
    },
    {
      id: 'training_data',
      type: 'task',
      task_name: 'MLTrainingDataFromROIs',
      comment: 'Extract spectral training samples from the ROIs',
    },
    {
      id: 'train_model',
      type: 'task',
      task_name: 'TrainRandomForest',
      comment: 'Train Random Forest classifier from labeled samples',
    },
    {
      id: 'classify',
      type: 'task',
      task_name: 'MachineLearningClassification',
      comment: 'Apply the trained model to classify the entire image',
    },
    {
      id: 'smooth',
      type: 'task',
      task_name: 'ClassificationSmoothing',
      comment: 'Remove salt-and-pepper noise from the classification result',
    },
    {
      id: 'outputs',
      type: 'outputparameters',
    },
  ];

  const edges = [
    {
      from: 'inputs',
      from_parameters: ['input_raster'],
      to: 'normstats',
      to_parameters: ['input_rasters'],
    },
    {
      from: 'inputs',
      from_parameters: ['input_raster'],
      to: 'training_data',
      to_parameters: ['input_raster'],
    },
    {
      from: 'inputs',
      from_parameters: ['training_roi'],
      to: 'training_data',
      to_parameters: ['input_roi'],
    },
    {
      from: 'normstats',
      from_parameters: ['normalization'],
      to: 'training_data',
      to_parameters: ['normalize_min_max'],
    },
    {
      from: 'training_data',
      from_parameters: ['output_raster'],
      to: 'train_model',
      to_parameters: ['input_rasters'],
    },
    {
      from: 'inputs',
      from_parameters: ['input_raster'],
      to: 'classify',
      to_parameters: ['input_raster'],
    },
    {
      from: 'train_model',
      from_parameters: ['output_model'],
      to: 'classify',
      to_parameters: ['input_model'],
    },
    {
      from: 'normstats',
      from_parameters: ['normalization'],
      to: 'classify',
      to_parameters: ['normalize_min_max'],
    },
    {
      from: 'classify',
      from_parameters: ['output_raster'],
      to: 'smooth',
      to_parameters: ['input_raster'],
    },
    {
      from: 'smooth',
      from_parameters: ['output_raster'],
      to: 'outputs',
      to_parameters: [''],
    },
  ];

  const outputPath = join(
    tmpdir(),
    `test_image_classification_ml_${Date.now()}.model`,
  );

  const result = await CallMCPTool<MCPTool_CreateENVIModelerWorkflow>(
    MCP_TOOL_LOOKUP.CREATE_ENVI_MODELER_WORKFLOW,
    {
      nodes,
      edges,
      output_path: outputPath,
    },
  );

  LogWhenExpectSuccess(result);
  expect(result.isError).toBeFalsy();

  // Verify output file exists
  expect(existsSync(outputPath)).toBeTruthy();

  // Clean up output file
  if (existsSync(outputPath)) {
    unlinkSync(outputPath);
  }
};
