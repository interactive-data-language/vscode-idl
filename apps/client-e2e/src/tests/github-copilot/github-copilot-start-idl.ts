import { Sleep } from '@idl/shared/extension';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../runner.interface';
import { CreateMCPClient } from './helpers/create-mcp-client';

/**
 * Function that verifies that we can do basic debugging of IDL sessions
 * and launch a new debugging session.
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

  console.log(JSON.stringify(result, undefined, 2));

  await Sleep(2000);

  // make sure that a list of tools are returned
  // expect(tools.tools).toBeDefined();
};
