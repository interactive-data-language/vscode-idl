import {
  MCP_TOOL_LOOKUP,
  MCPTool_RunENVITool,
  MCPToolResponse,
} from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';
import { ENVITestDatasets } from '../../helpers/envi-test-datasets.class';
import { LogWhenExpectSuccess } from '../../helpers/test-loggers';

/**
 * Makes sure we can pass in outputs from multi-dimensional arrays for input
 *
 * This also tests that we can run tasks with optional output parameters which
 * were failing before
 */
export const RunMCPTestENVIMultiDimensionalArray: RunnerFunction = async (
  init,
) => {
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.RUN_ENVI_TOOL, {
    toolName: 'SpectralAngleMapperClassification',
    inputParameters: {
      input_raster: ENVITestDatasets.raster(),
      class_colors: [
        [240, 240, 0],
        [255, 0, 0],
      ],
      class_names: ['Disturbed Earth', 'Bright Roof'],
      mean: [
        [301.4, 541.8, 504.0, 591.8],
        [707.6, 1157.825, 919.0, 976.575],
      ],
      output_raster_uri: '!',
    },
    interactive: false,
  });

  // log
  LogWhenExpectSuccess(result);

  // make sure the tool runs
  expect(result.isError).toBeFalsy();
};

/**
 * Connect outputs from one task to another to make sure fetching and
 * sending on is OK
 */
export const RunMCPTestENVIMultiDimensionalArrayMultiStep: RunnerFunction =
  async (init) => {
    const result = await CallMCPTool(MCP_TOOL_LOOKUP.RUN_ENVI_TOOL, {
      toolName: 'ROIStatistics',
      inputParameters: {
        input_raster: ENVITestDatasets.raster(),
        input_roi: [ENVITestDatasets.roi()],
      },
      interactive: false,
    });

    // log
    LogWhenExpectSuccess(result);

    // make sure the tool runs
    expect(result.isError).toBeFalsy();

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

    // run second task
    const result2 = await CallMCPTool(MCP_TOOL_LOOKUP.RUN_ENVI_TOOL, {
      toolName: 'SpectralAngleMapperClassification',
      inputParameters: {
        input_raster: ENVITestDatasets.raster(),
        class_colors: results.outputParameters.roi_colors,
        class_names: results.outputParameters.roi_names,
        mean: results.outputParameters.mean,
        output_raster_uri: '!',
      },
      interactive: false,
    });

    // log
    LogWhenExpectSuccess(result2);

    // make sure the tool runs
    expect(result2.isError).toBeFalsy();
  };
