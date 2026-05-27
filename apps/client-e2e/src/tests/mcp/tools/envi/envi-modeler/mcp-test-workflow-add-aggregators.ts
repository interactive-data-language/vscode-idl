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
 * Test creating a workflow with aggregators (image intersection + layer stacking)
 */
export const RunMCPTestWorkflowAddAggregators: RunnerFunction = async (
  _init,
) => {
  // Define workflow nodes and edges
  const nodes: ENVIModelerNode[] = [
    {
      id: 'input_params',
      type: 'inputparameters',
      display_name: 'Input Parameters',
      parameters: [
        {
          name: 'input_raster1',
          display_name: 'First Input Raster',
          description: 'First raster for image intersection',
          type: 'ENVIRaster',
        },
        {
          name: 'input_raster2',
          display_name: 'Second Input Raster',
          description: 'Second raster for image intersection',
          type: 'ENVIRaster',
        },
      ],
    },
    {
      id: 'intersection_task',
      type: 'task',
      display_name: 'Image Intersection',
      task_name: 'ImageIntersection',
      comment: 'Finds the overlapping area between two input rasters',
    },
    {
      id: 'layerstack_task',
      type: 'task',
      display_name: 'Build Layer Stack',
      task_name: 'BuildLayerStack',
      comment:
        'Stacks the two intersection results into a single multi-band raster',
    },
    {
      id: 'output_params',
      type: 'outputparameters',
      display_name: 'Output Parameters',
    },
  ];

  const edges = [
    {
      from: 'input_params',
      from_parameters: ['input_raster1'],
      to: 'intersection_task',
      to_parameters: ['input_raster1'],
    },
    {
      from: 'input_params',
      from_parameters: ['input_raster2'],
      to: 'intersection_task',
      to_parameters: ['input_raster2'],
    },
    {
      from: 'intersection_task',
      from_parameters: ['output_raster1', 'output_raster2'],
      to: 'layerstack_task',
      to_parameters: ['input_rasters'],
    },
    {
      from: 'layerstack_task',
      from_parameters: ['output_raster'],
      to: 'output_params',
      to_parameters: [''],
    },
  ];

  // Generate temp output path
  const outputPath = join(tmpdir(), `test_add_aggregators_${Date.now()}.model`);

  // Call the MCP tool to create the workflow
  const result = await CallMCPTool<MCPTool_CreateENVIModelerWorkflow>(
    MCP_TOOL_LOOKUP.CREATE_ENVI_MODELER_WORKFLOW,
    {
      nodes,
      edges,
      output_path: outputPath,
    },
  );

  // Log if failure
  LogWhenExpectSuccess(result);

  // Verify the tool succeeded
  expect(result.isError).toBeFalsy();

  // Verify output file exists
  expect(existsSync(outputPath)).toBeTruthy();

  // Clean up output file
  if (existsSync(outputPath)) {
    unlinkSync(outputPath);
  }
};
