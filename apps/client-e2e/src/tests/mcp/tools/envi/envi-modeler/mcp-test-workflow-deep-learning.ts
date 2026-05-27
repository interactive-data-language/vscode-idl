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
 * Test creating a deep learning pixel classification workflow
 */
export const RunMCPTestWorkflowDeepLearning: RunnerFunction = async (_init) => {
  const nodes: ENVIModelerNode[] = [
    {
      id: 'inputs',
      type: 'inputparameters',
      parameters: [
        {
          name: 'input_raster',
          display_name: 'Input Raster',
          description: 'Raster to classify',
          type: 'ENVIRaster',
        },
        {
          name: 'input_model',
          display_name: 'Deep Learning Model',
          description:
            'Trained ENVI ONNX pixel segmentation model (.envi.onnx)',
          type: 'ENVIVIRTUALIZABLEURI',
        },
      ],
    },
    {
      id: 'classify',
      type: 'task',
      task_name: 'DeepLearningPixelClassification',
      comment: 'Apply ONNX pixel-segmentation model to the input raster',
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
      to: 'classify',
      to_parameters: ['input_raster'],
    },
    {
      from: 'inputs',
      from_parameters: ['input_model'],
      to: 'classify',
      to_parameters: ['input_model'],
    },
    {
      from: 'classify',
      from_parameters: ['output_classification_raster'],
      to: 'outputs',
      to_parameters: [''],
    },
  ];

  const outputPath = join(tmpdir(), `test_deep_learning_${Date.now()}.model`);

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
