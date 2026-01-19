import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../runner.interface';
import { CallMCPTool } from './helpers/call-mcp-tool';

/**
 * Makes sure we can start IDL through MCP
 */
export const RunGitHubCopilotStartIDL: RunnerFunction = async (init) => {
  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.IDL_START, {});

  // make sure the tool runs
  expect(result.isError).toBeFalsy();
};
