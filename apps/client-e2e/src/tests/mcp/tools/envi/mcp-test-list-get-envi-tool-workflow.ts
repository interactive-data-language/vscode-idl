import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure we can list ENVI Tool workflows and return the list
 */
export const RunMCPTestGetENVIToolWorkflow: RunnerFunction = async (init) => {
  // Call a tool
  const result = await CallMCPTool(
    MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS,
    {}
  );

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(1);

  // init variable
  let toolsList: string[];

  // attempt to parse
  try {
    toolsList = JSON.parse(result.content[0].text as string);
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(toolsList).toBeTruthy();

  // make sure we have an object first
  expect(Array.isArray(toolsList)).toBeTruthy();

  // verify we have tools named
  expect(toolsList.length).toBeGreaterThan(0);

  // Call a tool
  const result2 = await CallMCPTool(MCP_TOOL_LOOKUP.GET_ENVI_TOOL_WORKFLOW, {
    name: toolsList[0],
  });

  // make result2 the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result2.content as any[])?.length).toEqual(1);

  // validate we get a string back
  expect(typeof result.content[0].text).toEqual('string');
};
