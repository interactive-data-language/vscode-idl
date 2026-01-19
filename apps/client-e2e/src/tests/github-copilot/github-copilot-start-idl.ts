import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../runner.interface';
import { CreateMCPClient } from './helpers/create-mcp-client';

/**
 * Makes sure we can start IDL through MCP
 */
export const RunGitHubCopilotStartIDL: RunnerFunction = async (init) => {
  const client = await CreateMCPClient(init.ports.mcp);

  // Call a tool
  const result = await client.callTool({
    name: MCP_TOOL_LOOKUP.IDL_START,
    arguments: {},
  });

  // make sure the tool runs
  expect(result.isError).toBeFalsy();
};
