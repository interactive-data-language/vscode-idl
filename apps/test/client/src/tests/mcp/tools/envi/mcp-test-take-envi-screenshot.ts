import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure we can take a screenshot of the ENVI display via MCP
 */
export const RunMCPTestTakeENVIScreenshot: RunnerFunction = async (init) => {
  /**
   * Take a screenshot with no explicit output path (uses temp path)
   */
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.TAKE_ENVI_SCREENSHOT, {});

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // verify IDL is still running
  expect(init.debug.adapter.isStarted()).toBeTruthy();

  // make sure we succeeded
  expect(result.content[0].type).toEqual('image');
};
