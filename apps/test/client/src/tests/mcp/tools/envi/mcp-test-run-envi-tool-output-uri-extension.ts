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
import { GetTextContent } from '../../helpers/get-text-content';
import { LogWhenExpectSuccess } from '../../helpers/test-loggers';

/**
 * Makes sure that, when an output URI parameter is given a mismatched file
 * extension, we replace it with the expected extension instead of appending
 * to it (i.e. "envi_tool.tif" becomes "envi_tool.dat", not "envi_tool.tif.dat")
 */
export const RunMCPTestRunENVIToolOutputUriExtension: RunnerFunction = async (
  init,
) => {
  /** Output raster URI, specified with the wrong extension on purpose */
  const wrongExtUri = join(tmpdir(), 'envi_tool_extension.tif');

  /** Expected output raster URI after extension is corrected */
  const outUri = join(tmpdir(), 'envi_tool_extension.dat');

  if (existsSync(outUri)) {
    unlinkSync(outUri);
  }

  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.RUN_ENVI_TOOL, {
    toolName: 'ISODataClassification',
    inputParameters: {
      input_raster: ENVITestDatasets.raster(),
      output_raster_uri: wrongExtUri,
    },
    interactive: false,
  });

  // log
  LogWhenExpectSuccess(result);

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(1);

  // make sure output file exists with the corrected extension
  expect(existsSync(outUri)).toBeTruthy();

  // make sure we didn't just append the extension to the wrong one
  expect(existsSync(wrongExtUri)).toBeFalsy();
  expect(existsSync(`${wrongExtUri}.dat`)).toBeFalsy();

  // init variable
  let results!: MCPToolResponse<MCPTool_RunENVITool>;

  // attempt to parse
  try {
    results = JSON.parse(GetTextContent(result.content));
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(results).toBeTruthy();

  // type check to make compiler happy
  if (!results.success) {
    return;
  }

  // make sure we have an object first
  expect(typeof results).toEqual('object');

  // verify we have more than 200 tools
  expect('output_raster' in results.result).toBeTruthy();

  // verify output object uses the corrected extension
  expect(results.result['output_raster']).toEqual({
    factory: 'URLRaster',
    url: outUri,
    auxiliary_url: [outUri.replace('.dat', '.hdr')],
  });
};
