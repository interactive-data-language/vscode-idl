import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../runner.interface';
import { CallMCPTool } from '../helpers/call-mcp-tool';

/**
 * Extra tests for getting resources
 *
 * Some covered in the "resources-workflow" file next to this
 */
export const RunGitHubGetResources: RunnerFunction = async (init) => {
  // Call a tool
  const listResources = await CallMCPTool(
    MCP_TOOL_LOOKUP.RESOURCES_GET_RESOURCE,
    {
      names: [`I'm blue, da-ba-dee, da-ba-di`],
    }
  );

  // make sure the tool fails as expected
  expect(listResources.isError).toBeTruthy();
};
