import expect from 'expect';

import { RunnerFunction } from '../runner.interface';
import { CreateMCPClient } from './helpers/create-mcp-client';

/**
 * Function that verifies that we can do basic debugging of IDL sessions
 * and launch a new debugging session.
 */
export const RunGitHubCopilotValidateMCPConnection: RunnerFunction = async (
  init
) => {
  const client = await CreateMCPClient(init.ports.mcp);

  // make a request
  const tools = await client.listTools();

  // make sure that a list of tools are returned
  expect(tools.tools).toBeDefined();
  expect(tools.tools.length > 0).toBeTruthy();
};
