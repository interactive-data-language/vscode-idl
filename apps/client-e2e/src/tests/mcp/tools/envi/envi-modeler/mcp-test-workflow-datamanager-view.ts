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
 * Test creating workflows with datamanager and view nodes (valid cases)
 */
export const RunMCPTestWorkflowDatamanagerView: RunnerFunction = async (
  _init,
) => {
  // Test 1: Valid ENVIRaster to datamanager
  const nodes1: ENVIModelerNode[] = [
    {
      id: 'input_params',
      type: 'inputparameters',
      parameters: [
        {
          name: 'input_raster',
          display_name: 'Input Raster',
          description: 'A raster',
          type: 'ENVIRaster',
        },
      ],
    },
    {
      id: 'spectral_index',
      type: 'task',
      task_name: 'SpectralIndex',
      static_input: {
        index: 'Normalized Difference Vegetation Index',
      },
    },
    {
      id: 'datamanager',
      type: 'datamanager',
    },
  ];

  const edges1 = [
    {
      from: 'input_params',
      from_parameters: ['input_raster'],
      to: 'spectral_index',
      to_parameters: ['input_raster'],
    },
    {
      from: 'spectral_index',
      from_parameters: ['output_raster'],
      to: 'datamanager',
      to_parameters: [''],
    },
  ];

  const outputPath1 = join(
    tmpdir(),
    `test_datamanager_view_1_${Date.now()}.model`,
  );

  const result1 = await CallMCPTool<MCPTool_CreateENVIModelerWorkflow>(
    MCP_TOOL_LOOKUP.CREATE_ENVI_MODELER_WORKFLOW,
    {
      nodes: nodes1,
      edges: edges1,
      output_path: outputPath1,
    },
  );

  LogWhenExpectSuccess(result1);
  expect(result1.isError).toBeFalsy();

  // Verify output files exist
  expect(existsSync(outputPath1)).toBeTruthy();

  // Clean up output files
  if (existsSync(outputPath1)) {
    unlinkSync(outputPath1);
  }

  // Test 2: Valid ENVIRaster to view
  const nodes2: ENVIModelerNode[] = [
    {
      id: 'input_params',
      type: 'inputparameters',
      parameters: [
        {
          name: 'input_raster',
          display_name: 'Input Raster',
          description: 'A raster',
          type: 'ENVIRaster',
        },
      ],
    },
    {
      id: 'spectral_index',
      type: 'task',
      task_name: 'SpectralIndex',
      static_input: {
        index: 'Normalized Difference Vegetation Index',
      },
    },
    {
      id: 'view',
      type: 'view',
    },
  ];

  const edges2 = [
    {
      from: 'input_params',
      from_parameters: ['input_raster'],
      to: 'spectral_index',
      to_parameters: ['input_raster'],
    },
    {
      from: 'spectral_index',
      from_parameters: ['output_raster'],
      to: 'view',
      to_parameters: [''],
    },
  ];

  const outputPath2 = join(
    tmpdir(),
    `test_datamanager_view_2_${Date.now()}.model`,
  );

  const result2 = await CallMCPTool<MCPTool_CreateENVIModelerWorkflow>(
    MCP_TOOL_LOOKUP.CREATE_ENVI_MODELER_WORKFLOW,
    {
      nodes: nodes2,
      edges: edges2,
      output_path: outputPath2,
    },
  );

  LogWhenExpectSuccess(result2);
  expect(result2.isError).toBeFalsy();

  // Verify output files exist
  expect(existsSync(outputPath2)).toBeTruthy();

  // Clean up output files
  if (existsSync(outputPath2)) {
    unlinkSync(outputPath2);
  }
};
