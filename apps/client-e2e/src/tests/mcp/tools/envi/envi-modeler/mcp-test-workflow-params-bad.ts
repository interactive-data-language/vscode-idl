import {
  ENVIModelerNode,
  MCP_TOOL_LOOKUP,
  MCPTool_CreateENVIModelerWorkflow,
} from '@idl/types/mcp';
import expect from 'expect';
import { tmpdir } from 'os';
import { join } from 'path';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';

/**
 * Test workflow validation with bad parameters (invalid parameter names)
 */
export const RunMCPTestWorkflowParamsBad: RunnerFunction = async (_init) => {
  const nodes: ENVIModelerNode[] = [
    {
      id: 'inputs',
      type: 'inputparameters',
      parameters: [
        {
          name: 'time1_raster',
          display_name: 'Time 1 Image',
          description: 'Pre-event raster image',
          type: 'ENVIRaster',
        },
        {
          name: 'time2_raster',
          display_name: 'Time 2 Image',
          description: 'Post-event raster image',
          type: 'ENVIRaster',
        },
        {
          name: 'training_rois',
          display_name: 'Training ROIs',
          description: 'ROIs with Background (no change) and Change classes',
          type: 'ENVIROIArray',
        },
      ],
    },
    {
      id: 'intersection',
      type: 'task',
      display_name: 'Image Intersection',
      task_name: 'ImageIntersection',
    },
    {
      id: 'bandstack',
      type: 'task',
      display_name: 'Build Band Stack',
      task_name: 'BuildBandStack',
    },
    {
      id: 'normstats',
      type: 'task',
      display_name: 'Normalization Statistics',
      task_name: 'NormalizationStatistics',
    },
    {
      id: 'trainingdata',
      type: 'task',
      display_name: 'Extract Training Data',
      task_name: 'MLTrainingDataFromROIs',
    },
    {
      id: 'trainmodel',
      type: 'task',
      display_name: 'Train Random Forest Model',
      task_name: 'TrainRandomForest',
    },
    {
      id: 'classify',
      type: 'task',
      display_name: 'ML Classification',
      task_name: 'MachineLearningClassification',
    },
    {
      id: 'smoothing',
      type: 'task',
      display_name: 'Classification Smoothing',
      task_name: 'ClassificationSmoothing',
    },
    {
      id: 'outputs',
      type: 'outputparameters',
      display_name: 'Workflow Outputs',
    },
    { id: 'view_result', type: 'view', display_name: 'View Result' },
  ];

  // Edges with invalid parameter names
  const edges = [
    {
      from: 'inputs',
      from_parameters: ['time1_raster', 'time2_raster'],
      to: 'intersection',
      to_parameters: ['input_raster1', 'input_raster2'],
    },
    {
      from: 'intersection',
      from_parameters: ['output_raster1', 'output_raster2'],
      to: 'bandstack',
      to_parameters: ['input_raster1', 'input_raster2'],
    },
    {
      from: 'bandstack',
      from_parameters: ['output_raster'],
      to: 'normstats',
      to_parameters: ['input_raster'], // Invalid parameter name
    },
    {
      from: 'bandstack',
      from_parameters: ['output_raster'],
      to: 'trainingdata',
      to_parameters: ['input_raster'],
    },
    {
      from: 'inputs',
      from_parameters: ['training_rois'],
      to: 'trainingdata',
      to_parameters: ['input_roi'],
    },
    {
      from: 'trainingdata',
      from_parameters: ['output_training_data'], // Invalid parameter name
      to: 'trainmodel',
      to_parameters: ['input_training_data'], // Invalid parameter name
    },
    {
      from: 'normstats',
      from_parameters: ['output_normalization_statistics'], // Invalid parameter name
      to: 'trainmodel',
      to_parameters: ['input_normalization_statistics'], // Invalid parameter name
    },
    {
      from: 'bandstack',
      from_parameters: ['output_raster'],
      to: 'classify',
      to_parameters: ['input_raster'],
    },
    {
      from: 'trainmodel',
      from_parameters: ['output_model'],
      to: 'classify',
      to_parameters: ['input_model'],
    },
    {
      from: 'normstats',
      from_parameters: ['output_normalization_statistics'], // Invalid parameter name
      to: 'classify',
      to_parameters: ['input_normalization_statistics'], // Invalid parameter name
    },
    {
      from: 'classify',
      from_parameters: ['output_raster'],
      to: 'smoothing',
      to_parameters: ['input_raster'],
    },
    {
      from: 'smoothing',
      from_parameters: ['output_raster'],
      to: 'outputs',
      to_parameters: [''],
    },
    {
      from: 'smoothing',
      from_parameters: ['output_raster'],
      to: 'view_result',
      to_parameters: ['input_raster'],
    },
  ];

  const outputPath = join(tmpdir(), `test_params_bad_${Date.now()}.model`);

  const result = await CallMCPTool<MCPTool_CreateENVIModelerWorkflow>(
    MCP_TOOL_LOOKUP.CREATE_ENVI_MODELER_WORKFLOW,
    {
      nodes,
      edges,
      output_path: outputPath,
    },
  );

  // Verify the tool failed due to validation error
  expect(result.isError).toBeTruthy();
};
