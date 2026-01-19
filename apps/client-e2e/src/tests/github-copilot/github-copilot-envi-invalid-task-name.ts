import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../runner.interface';
import { CreateMCPClient } from './helpers/create-mcp-client';

/** Task name we will never have */
const FAKE_NAME = 'Hello. My name is Inigo Montoya.';

/**
 * Makes sure MCP tool fails when we have tasks that don't exist
 */
export const RunGitHubCopilotENVIInvalidTaskName: RunnerFunction = async (
  init
) => {
  const client = await CreateMCPClient(init.ports.mcp);

  // query parameters fail
  const result1 = await client.callTool({
    name: MCP_TOOL_LOOKUP.ENVI_GET_TOOL_PARAMETERS,
    arguments: {
      taskName: FAKE_NAME,
    },
  });

  // make sure the tool runs
  expect(result1.isError).toBeTruthy();

  // running fails
  const result2 = await client.callTool({
    name: MCP_TOOL_LOOKUP.ENVI_RUN_TOOL,
    arguments: {
      taskName: FAKE_NAME,
      inputParameters: {},
      interactive: false,
    },
  });

  // make sure the tool runs
  expect(result2.isError).toBeTruthy();
};
