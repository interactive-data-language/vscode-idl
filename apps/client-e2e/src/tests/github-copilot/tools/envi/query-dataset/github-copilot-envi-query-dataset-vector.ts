import {
  MCP_TOOL_LOOKUP,
  MCPTool_ENVIQueryDataset,
  MCPToolResponse,
} from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { ENVITestDatasets } from '../../../helpers/envi-test-datasets.class';

/**
 * Makes sure we can query a dataset
 */
export const RunGitHubCopilotENVIQueryDataset_Vector: RunnerFunction = async (
  init
) => {
  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.ENVI_QUERY_DATASET, {
    dataset: ENVITestDatasets.vector(),
  });

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(1);

  // init variable
  let results: MCPToolResponse<MCPTool_ENVIQueryDataset>;

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
      record_type: 'Polyline',
      nrecords: 4102,
      data_range: [
        -179.99999999999991, -85.22193775799991, 180, 83.63410065300008,
      ],
      coord_sys_str:
        'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]',
    },
  ]);
};
