import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { LogWhenExpectError } from '../../../helpers/test-loggers';

/**
 * Makes sure we throw an error when we call the MCP tool without the proper
 * input parameters
 */
export const RunMCPTestOpenDatasetsInENVI_NoInput: RunnerFunction = async (
  init,
) => {
  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI, {
    automaticZoom: 'all-layers',
    resetView: true,
  } as any);

  // log if success
  LogWhenExpectError(result);

  // make sure the tool runs
  expect(result.isError).toBeTruthy();
};
