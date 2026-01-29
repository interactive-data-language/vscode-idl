import {
  MCP_TOOL_LOOKUP,
  MCPTool_QueryDatasetWithENVI,
  MCPToolResponse,
} from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { ENVITestDatasets } from '../../../helpers/envi-test-datasets.class';

/**
 * Makes sure we can query a dataset
 */
export const RunGitHubCopilotQueryDatasetWithENVI_ROI: RunnerFunction = async (
  init
) => {
  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI, {
    dataset: ENVITestDatasets.roi(),
  });

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(1);

  // init variable
  let results: MCPToolResponse<MCPTool_QueryDatasetWithENVI>;

  // attempt to parse
  try {
    results = JSON.parse(result.content[0].text as string);
  } catch (err) {
    // do nothing
  }

  // make sure we got an answer
  expect(results).toBeTruthy();

  // remove dehydrated dataset
  for (let i = 0; i < results.info.length; i++) {
    delete results.info[i]['dataset'];
  }

  // compare
  expect(results.info).toEqual([
    {
      name: 'Disturbed Earth',
      color: [240, 240, 0],
      n_definitions: 1,
    },
    {
      name: 'Bright Roof',
      color: [255, 0, 0],
      n_definitions: 1,
    },
    {
      name: 'Water',
      color: [29, 29, 255],
      n_definitions: 1,
    },
  ]);
};
