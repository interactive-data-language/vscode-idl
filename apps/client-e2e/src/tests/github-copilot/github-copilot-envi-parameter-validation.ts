import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../runner.interface';
import { CreateMCPClient } from './helpers/create-mcp-client';

/**
 * Function that verifies that we can do basic debugging of IDL sessions
 * and launch a new debugging session.
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
