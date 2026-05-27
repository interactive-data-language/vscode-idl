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
 * Test creating an image registration workflow
 */
export const RunMCPTestWorkflowImageRegistration: RunnerFunction = async (
  _init,
) => {
  const nodes: ENVIModelerNode[] = [
    {
      id: 'inputs',
      type: 'inputparameters',
      parameters: [
        {
          name: 'base_raster',
          display_name: 'Base Raster (Reference)',
          description: 'Reference image with accurate georeferencing',
          type: 'ENVIRaster',
        },
        {
          name: 'warp_raster',
          display_name: 'Warp Raster',
          description: 'Image to be aligned to the base raster',
          type: 'ENVIRaster',
        },
      ],
    },
    {
      id: 'gen_tiepoints',
      type: 'task',
      task_name: 'GenerateTiePointsByCrossCorrelation',
      comment: 'Automatically match features between base and warp images',
    },
    {
      id: 'filter_tiepoints',
      type: 'task',
      task_name: 'FilterTiePointsByGlobalTransform',
      comment: 'Remove outlier tie points using global transform',
    },
    {
      id: 'register',
      type: 'task',
      task_name: 'ImageToImageRegistration',
      static_input: {
        warping: 'Triangulation',
      },
      comment:
        'Warp the image to align with the base raster using Triangulation',
    },
    {
      id: 'outputs',
      type: 'outputparameters',
    },
  ];

  const edges = [
    {
      from: 'inputs',
      from_parameters: ['base_raster'],
      to: 'gen_tiepoints',
      to_parameters: ['input_raster1'],
    },
    {
      from: 'inputs',
      from_parameters: ['warp_raster'],
      to: 'gen_tiepoints',
      to_parameters: ['input_raster2'],
    },
    {
      from: 'gen_tiepoints',
      from_parameters: ['output_tiepoints'],
      to: 'filter_tiepoints',
      to_parameters: ['input_tiepoints'],
    },
    {
      from: 'filter_tiepoints',
      from_parameters: ['output_tiepoints'],
      to: 'register',
      to_parameters: ['input_tiepoints'],
    },
    {
      from: 'register',
      from_parameters: ['output_raster'],
      to: 'outputs',
      to_parameters: [''],
    },
  ];

  const outputPath = join(
    tmpdir(),
    `test_image_registration_${Date.now()}.model`,
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
