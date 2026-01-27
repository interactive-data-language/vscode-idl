import {
  MCP_TOOL_LOOKUP,
  MCPTool_ENVIOpenDatasets,
  MCPToolResponse,
} from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { ENVITestDatasets } from '../../../helpers/envi-test-datasets.class';

/**
 * Makes sure we can open and display a dataset in ENVI
 */
export const RunGitHubCopilotENVIOpenDatasets_RasterSeries: RunnerFunction =
  async (init) => {
    // Call a tool
    const result = await CallMCPTool(MCP_TOOL_LOOKUP.ENVI_OPEN_DATASETS, {
      datasets: [ENVITestDatasets.rasterSeries()],
      automaticZoom: 'all-layers',
      resetView: true,
    });

    // make sure the tool runs
    expect(result.isError).toBeFalsy();

    // make sure the tool runs
    expect((result.content as any[])?.length).toEqual(1);

    // init variable
    let results: MCPToolResponse<MCPTool_ENVIOpenDatasets>;

    // attempt to parse
    try {
      results = JSON.parse(result.content[0].text as string);
    } catch (err) {
      // do nothing
    }

    // make sure we got an answer
    expect(results).toBeTruthy();
    expect(results.success).toBeTruthy();
  };
