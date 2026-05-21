import {
  ENVIModelerNode,
  MCP_TOOL_LOOKUP,
  MCPTool_CreateENVIModelerWorkflow,
} from '@idl/types/mcp';
import expect from 'expect';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { LogWhenExpectError } from '../../../helpers/test-loggers';

/**
 * Test that creating a workflow fails when the output file already exists
 */
export const RunMCPTestWorkflowFileExistsError: RunnerFunction = async (
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
          description: 'Raster to classify',
          type: 'ENVIRaster',
        },
      ],
    },
    {
      id: 'isodata',
      type: 'task',
      task_name: 'ISODATAClassification',
    },
    {
      id: 'view',
      type: 'view',
    },
  ];

  const edges = [
    {
      from: 'inputs',
      from_parameters: ['input_raster'],
      to: 'isodata',
      to_parameters: ['input_raster'],
    },
    {
      from: 'isodata',
      from_parameters: ['output_raster'],
      to: 'view',
      to_parameters: ['input_raster'],
    },
  ];

  const outputPath = join(
    tmpdir(),
    `test_file_exists_error_${Date.now()}.model`,
  );

  // Create a placeholder file to simulate an existing file
  writeFileSync(outputPath, 'existing file content', 'utf-8');
  expect(existsSync(outputPath)).toBeTruthy();

  // Attempt to create workflow with the same path — should fail
  const result = await CallMCPTool<MCPTool_CreateENVIModelerWorkflow>(
    MCP_TOOL_LOOKUP.CREATE_ENVI_MODELER_WORKFLOW,
    {
      nodes,
      edges,
      output_path: outputPath,
    },
  );

  LogWhenExpectError(result);

  // Verify the tool returned an error
  expect(result.isError).toBeTruthy();

  // Clean up test file
  if (existsSync(outputPath)) {
    unlinkSync(outputPath);
  }
};
