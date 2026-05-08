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
 * Test creating a change detection workflow using spectral angle difference
 */
export const RunMCPTestWorkflowChangeDetection: RunnerFunction = async (
  _init,
) => {
  const nodes: ENVIModelerNode[] = [
    {
      id: 'inputs',
      type: 'inputparameters',
      parameters: [
        {
          name: 'before_raster',
          display_name: 'Before Raster (Time 1)',
          description: 'Raster from the earlier time period',
          type: 'ENVIRaster',
        },
        {
          name: 'after_raster',
          display_name: 'After Raster (Time 2)',
          description: 'Raster from the later time period',
          type: 'ENVIRaster',
        },
      ],
    },
    {
      id: 'intersect',
      type: 'task',
      task_name: 'ImageIntersection',
      comment: 'Clip both images to the same spatial extent and pixel grid',
    },
    {
      id: 'sam_diff',
      type: 'task',
      task_name: 'SAMImageDifference',
      comment: 'Compute spectral-angle difference; smaller angle = less change',
    },
    {
      id: 'outputs',
      type: 'outputparameters',
    },
  ];

  const edges = [
    {
      from: 'inputs',
      from_parameters: ['before_raster'],
      to: 'intersect',
      to_parameters: ['input_raster1'],
    },
    {
      from: 'inputs',
      from_parameters: ['after_raster'],
      to: 'intersect',
      to_parameters: ['input_raster2'],
    },
    {
      from: 'intersect',
      from_parameters: ['output_raster1'],
      to: 'sam_diff',
      to_parameters: ['input_raster1'],
    },
    {
      from: 'intersect',
      from_parameters: ['output_raster2'],
      to: 'sam_diff',
      to_parameters: ['input_raster2'],
    },
    {
      from: 'sam_diff',
      from_parameters: ['output_raster'],
      to: 'outputs',
      to_parameters: [''],
    },
  ];

  const outputPath = join(
    tmpdir(),
    `test_change_detection_${Date.now()}.model`,
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
