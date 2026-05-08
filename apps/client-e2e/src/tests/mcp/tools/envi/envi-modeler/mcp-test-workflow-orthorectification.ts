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
 * Test creating an orthorectification workflow
 */
export const RunMCPTestWorkflowOrthorectification: RunnerFunction = async (
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
          description: 'RPC-based raster to orthorectify',
          type: 'ENVIRaster',
        },
        {
          name: 'dem_raster',
          display_name: 'DEM Raster',
          description: 'Digital elevation model for terrain correction',
          type: 'ENVIRaster',
        },
      ],
    },
    {
      id: 'ortho',
      type: 'task',
      task_name: 'RPCOrthorectification',
      comment: 'Remove terrain-induced distortions using RPC metadata and DEM',
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
      to: 'ortho',
      to_parameters: ['input_raster'],
    },
    {
      from: 'inputs',
      from_parameters: ['dem_raster'],
      to: 'ortho',
      to_parameters: ['dem_raster'],
    },
    {
      from: 'ortho',
      from_parameters: ['output_raster'],
      to: 'outputs',
      to_parameters: [''],
    },
  ];

  const outputPath = join(
    tmpdir(),
    `test_orthorectification_${Date.now()}.model`,
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
