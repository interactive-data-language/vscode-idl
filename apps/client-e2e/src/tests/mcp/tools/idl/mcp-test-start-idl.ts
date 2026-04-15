import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure we can start IDL through MCP
 */
export const RunMCPTestStartIDL: RunnerFunction = async (init) => {
  // Call a tool
  const result = await CallMCPTool(
    MCP_TOOL_LOOKUP.MANAGE_IDL_AND_ENVI_SESSION,
    {
      action: 'start-idl',
    },
  );

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // verify we started
  expect(init.debug.adapter.isStarted()).toBeTruthy();
};
