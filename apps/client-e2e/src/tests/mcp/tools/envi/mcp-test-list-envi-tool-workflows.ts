import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { USER_TOOL_WORKFLOW } from '../../../../test-setup.interface';
import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';
import { GetTextContent } from '../../helpers/get-text-content';

/**
 * Makes sure we can list ENVI Tool Workflows
 */
export const RunMCPTestListENVIToolWorkflows: RunnerFunction = async (init) => {
  // Call a tool
  const result = await CallMCPTool(
    MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS,
    {},
  );

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(1);

  // init variable
  let toolsList!: string[];

  // attempt to parse
  try {
    toolsList = JSON.parse(GetTextContent(result.content));
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(toolsList).toBeTruthy();

  // make sure we have an object first
  expect(Array.isArray(toolsList)).toBeTruthy();

  // verify we have tools named
  expect(toolsList.length).toBeGreaterThan(0);

  // verify our test workflow is in the list
  expect(toolsList).toContain(USER_TOOL_WORKFLOW);
};
