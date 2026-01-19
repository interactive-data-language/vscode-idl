import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../runner.interface';
import { CreateMCPClient } from './helpers/create-mcp-client';

/**
 * Makes sure invalid input parameters cause tool execution to fail
 */
export const RunGitHubCopilotENVIParameterValidation: RunnerFunction = async (
  init
) => {
  const client = await CreateMCPClient(init.ports.mcp);

  // Call a tool
  const result = await client.callTool({
    name: MCP_TOOL_LOOKUP.ENVI_RUN_TOOL,
    arguments: {
      taskName: 'ISODataClassification',
      inputParameters: {},
      interactive: false,
    },
  });

  // make sure the tool runs
  expect(result.isError).toBeTruthy();
};
