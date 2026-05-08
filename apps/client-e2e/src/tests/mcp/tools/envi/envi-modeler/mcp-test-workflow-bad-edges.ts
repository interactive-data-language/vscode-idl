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
 * Test workflow validation with bad edges (node IDs don't exist)
 */
export const RunMCPTestWorkflowBadEdges: RunnerFunction = async (_init) => {
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

  // Invalid edges: reference non-existent node IDs
  const edges = [
    {
      from: 'input_params12', // Invalid node ID
      from_parameters: ['input_raster1'],
      to: 'intersection_task12', // Invalid node ID
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

  const outputPath = join(tmpdir(), `test_bad_edges_${Date.now()}.model`);

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
