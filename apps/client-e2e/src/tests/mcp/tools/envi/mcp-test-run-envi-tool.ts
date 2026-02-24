import {
  MCP_TOOL_LOOKUP,
  MCPTool_RunENVITool,
  MCPToolResponse,
} from '@idl/types/mcp';
import expect from 'expect';
import { existsSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';
import { ENVITestDatasets } from '../../helpers/envi-test-datasets.class';
import { LogWhenExpectSuccess } from '../../helpers/test-loggers';

/**
 * Makes sure we can run a simple ENVI tool
 */
export const RunMCPTestRunENVITool: RunnerFunction = async (init) => {
  /** Output raster URI */
  const outUri = join(tmpdir(), 'envi_tool.dat');
  if (existsSync(outUri)) {
    unlinkSync(outUri);
  }

  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.RUN_ENVI_TOOL, {
    toolName: 'ISODataClassification',
    inputParameters: {
      input_raster: ENVITestDatasets.raster(),
      change_threshold_percent: 2.0,
      iterations: 10,
      number_of_classes: 5,
      output_raster_uri: outUri,
    },
    interactive: false,
  });

  // log
  LogWhenExpectSuccess(result);

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(1);

  // make sure output file exists
  expect(existsSync(outUri)).toBeTruthy();

  // init variable
  let results: MCPToolResponse<MCPTool_RunENVITool>;

  // attempt to parse
  try {
    results = JSON.parse(result.content[0].text as string);
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(results).toBeTruthy();

  // make sure we have an object first
  expect(typeof results).toEqual('object');

  // verify we have more than 200 tools
  expect('output_raster' in results.outputParameters).toBeTruthy();

  // verify output object
  expect(results.outputParameters['output_raster']).toEqual({
    factory: 'URLRaster',
    url: outUri,
    auxiliary_url: [outUri.replace('.dat', '.hdr')],
  });
};
