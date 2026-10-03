import { ENVITestDatasets } from '@idl/envi/test-datasets';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_RunENVITool,
  MCPToolResponse,
} from '@idl/types/mcp';
import expect from 'expect';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import { basename, dirname, relative, sep } from 'path';

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
    const resolvedUri = results.result['output_raster'].url;

    // make sure the file name wasn't changed
    expect(basename(resolvedUri)).toEqual(fileName);

    // make sure the output actually exists where ENVI says it does
    expect(existsSync(resolvedUri)).toBeTruthy();

    /** Path from the OS temp dir down to the folder containing our output */
    const relativeDir = relative(tmpdir(), dirname(resolvedUri));

    // make sure it took exactly one extra folder (the session workspace) to
    // get from the temp dir to our file, not zero (written directly in temp)
    // and not more than one (nested deeper than the session workspace)
    expect(relativeDir.split(sep).length).toEqual(1);

    // make sure that folder is actually ENVI's temporary session workspace
    expect(relativeDir.startsWith('ENVI_Session_')).toBeTruthy();
  };
