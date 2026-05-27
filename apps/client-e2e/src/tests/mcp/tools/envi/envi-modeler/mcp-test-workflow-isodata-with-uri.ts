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
 * Test creating a workflow with URI output parameters
 */
export const RunMCPTestWorkflowIsodataWithUri: RunnerFunction = async (
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
          description: 'Raster to classify using ISODATA unsupervised method',
          type: 'ENVIRaster',
        },
        {
          name: 'output_raster_uri',
          display_name: 'Output Raster URI',
          description:
            'Fully-qualified path for the output classification raster',
          type: 'String',
        },
      ],
    },
    {
      id: 'isodata',
      type: 'task',
      task_name: 'ISODATAClassification',
      comment:
        'Cluster pixels into classes using the ISODATA unsupervised algorithm',
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
      to: 'isodata',
      to_parameters: ['input_raster'],
    },
    {
      from: 'inputs',
      from_parameters: ['output_raster_uri'],
      to: 'isodata',
      to_parameters: ['output_raster_uri'],
    },
    {
      from: 'isodata',
      from_parameters: ['output_raster'],
      to: 'outputs',
      to_parameters: [''],
    },
  ];

  const outputPath = join(
    tmpdir(),
    `test_isodata_with_uri_${Date.now()}.model`,
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
