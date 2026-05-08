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
 * Test creating a spectral index (NDVI) computation workflow
 */
export const RunMCPTestWorkflowDatasetIndex: RunnerFunction = async (_init) => {
  const nodes: ENVIModelerNode[] = [
    {
      id: 'inputs',
      type: 'inputparameters',
      parameters: [
        {
          name: 'input_raster',
          display_name: 'Input Raster',
          description:
            'Multi-spectral or hyperspectral raster with wavelength metadata',
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
      comment:
        'Compute NDVI to highlight vegetation; use QuerySpectralIndices to discover available indices for your raster',
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
      to: 'spectral_index',
      to_parameters: ['input_raster'],
    },
    {
      from: 'spectral_index',
      from_parameters: ['output_raster'],
      to: 'outputs',
      to_parameters: [''],
    },
  ];

  const outputPath = join(tmpdir(), `test_dataset_index_${Date.now()}.model`);

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
