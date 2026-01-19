import { Sleep } from '@idl/shared/extension';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../runner.interface';
import { CreateMCPClient } from './helpers/create-mcp-client';

/**
 * Makes sure ENVI tool notes load
 *
 * We get 3 items back when ntoes are present, 2 when no notes
 */
export const RunGitHubCopilotENVIToolNotesLoad: RunnerFunction = async (
  init
) => {
  const client = await CreateMCPClient(init.ports.mcp);

  // Call a tool
  const result = await client.callTool({
    name: MCP_TOOL_LOOKUP.ENVI_GET_TOOL_PARAMETERS,
    arguments: {
      taskName: 'ISODataClassification',
    },
  });

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(3);

  console.log(JSON.stringify(result, undefined, 2));

  await Sleep(3000);
};
