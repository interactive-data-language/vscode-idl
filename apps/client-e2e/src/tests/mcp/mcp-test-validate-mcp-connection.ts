import expect from 'expect';

import { RunnerFunction } from '../runner.interface';
import { CreateMCPClient } from './helpers/create-mcp-client';

/**
 * Makes sure we can connect to our MCP server and list our tools
 */
export const RunMCPTestValidateMCPConnection: RunnerFunction = async (init) => {
  const client = await CreateMCPClient(init.ports.mcp);

  // make a request
  const tools = await client.listTools();

  // make sure that a list of tools are returned
  expect(tools.tools).toBeDefined();
  expect(tools.tools.length > 0).toBeTruthy();
};
