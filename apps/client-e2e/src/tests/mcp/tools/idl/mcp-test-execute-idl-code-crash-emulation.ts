import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure we can start IDL through MCP
 */
export const RunMCPTestExecuteIDLCode_CrashEmulation: RunnerFunction = async (
  init,
) => {
  /**
   * Run code that completes
   */
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE, {
    code: `print, 'foo'`,
  });

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // verify we started
  expect(init.debug.adapter.isStarted()).toBeTruthy();

  /**
   * Run code that causes IDL to crash/exit
   */
  const runtimeError = await CallMCPTool(MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE, {
    code: `help, 42\nexit`,
  });

  expect(runtimeError.isError).toBeTruthy();

  // verify we stopped
  expect(init.debug.adapter.isStarted()).toBeFalsy();

  // verify that there was a reported
  expect(init.client.logger.tracker.errors).toBe(1);

  // reset the tracker
  init.client.logger.resetTracker();
};
