import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../runner.interface';
import { CallMCPTool } from '../helpers/call-mcp-tool';

/**
 * Makes sure we error when we get resources
 *
 * resources-workflow tests this working
 */
export const RunGitHubGetResources: RunnerFunction = async (init) => {
  // Call a tool
  const listResources = await CallMCPTool(
    MCP_TOOL_LOOKUP.RESOURCES_GET_RESOURCE,
    {
      names: [`I'm blue, da-ba-dee, da-ba-di`],
    }
  );

  // make sure the tool runs
  expect(listResources.isError).toBeTruthy();
};
