import { ENVITestDatasets } from '@idl/envi/test-datasets';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_RunENVITool,
  MCPToolResponse,
} from '@idl/types/mcp';
import expect from 'expect';
import { existsSync } from 'fs';
import { basename, dirname } from 'path';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';
import { GetTextContent } from '../../helpers/get-text-content';
import { LogWhenExpectSuccess } from '../../helpers/test-loggers';

/**
 * Makes sure that, when an output URI parameter is just a bare filename with
 * no directory, ENVI resolves it inside its own temporary session workspace
 * (i.e. "file.dat" becomes "<temp dir>/ENVI_Session_<random>/file.dat") instead
 * of writing next to the current working directory
 */
export const RunMCPTestRunENVIToolOutputUriSessionFolder: RunnerFunction =
  async (init) => {
    /** Bare filename with no directory component */
    const fileName = 'envi_tool_session_test.dat';

    // Call a tool
    const result = await CallMCPTool(MCP_TOOL_LOOKUP.RUN_ENVI_TOOL, {
      toolName: 'ISODataClassification',
      inputParameters: {
        input_raster: ENVITestDatasets.raster(),
        output_raster_uri: fileName,
      },
      interactive: false,
    });

    // log
    LogWhenExpectSuccess(result);

    // make sure the tool runs
    expect(result.isError).toBeFalsy();

    // make sure the tool runs
    expect((result.content as any[])?.length).toEqual(1);

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

    /** Resolved output URI that ENVI actually wrote to */
    const uri = results.result['output_raster'].url;

    // make sure the file name wasn't changed
    expect(basename(uri)).toEqual(fileName);

    // make sure the output actually exists where ENVI says it does
    expect(existsSync(uri)).toBeTruthy();

    // make sure that folder is actually ENVI's temporary session workspace
    expect(
      basename(dirname(uri)).toLowerCase().startsWith('envi_session_'),
    ).toBeTruthy();
  };
