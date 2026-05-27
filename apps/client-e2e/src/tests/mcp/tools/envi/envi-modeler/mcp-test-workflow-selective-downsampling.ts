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
 * Test creating a selective downsampling workflow
 */
export const RunMCPTestWorkflowSelectiveDownsampling: RunnerFunction = async (
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
          description: 'Source raster to process',
          type: 'ENVIRaster',
        },
        {
          name: 'mask_roi',
          display_name: 'Mask ROI',
          description: 'ROI identifying the regions to selectively downsample',
          type: 'ENVIROIArray',
        },
      ],
    },
    {
      id: 'downsample',
      type: 'task',
      task_name: 'PixelScaleResampleRaster',
      static_input: {
        pixel_scale: [4, 4],
        resampling: 'Nearest Neighbor',
      },
      comment: 'Downsample to coarse resolution to create a blocky appearance',
    },
    {
      id: 'roi_mask',
      type: 'task',
      task_name: 'ROIMaskRaster',
      static_input: {
        data_ignore_value: 0,
      },
      comment:
        'Apply ROI mask so only the target regions show the downsampled result',
    },
    {
      id: 'mosaic',
      type: 'task',
      task_name: 'BuildMosaicRaster',
      comment:
        'Composite the masked downsampled raster on top of the original; masked raster MUST be first',
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
      to: 'downsample',
      to_parameters: ['input_raster'],
    },
    {
      from: 'downsample',
      from_parameters: ['output_raster'],
      to: 'roi_mask',
      to_parameters: ['input_raster'],
    },
    {
      from: 'inputs',
      from_parameters: ['mask_roi'],
      to: 'roi_mask',
      to_parameters: ['input_mask_roi'],
    },
    {
      from: 'roi_mask',
      from_parameters: ['output_raster'],
      to: 'mosaic',
      to_parameters: ['input_rasters'],
    },
    {
      from: 'inputs',
      from_parameters: ['input_raster'],
      to: 'mosaic',
      to_parameters: ['input_rasters'],
    },
    {
      from: 'mosaic',
      from_parameters: ['output_raster'],
      to: 'outputs',
      to_parameters: [''],
    },
  ];

  const outputPath = join(
    tmpdir(),
    `test_selective_downsampling_${Date.now()}.model`,
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
