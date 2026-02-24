import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../runner.interface';
import { CallMCPTool } from '../helpers/call-mcp-tool';

/**
 * Makes sure we can list ENVI Tool workflows and return the list
 */
export const RunMCPTestListGetPrompts: RunnerFunction = async (init) => {
  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.LIST_PROMPTS, {});

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(1);

  // init variable
  let promptList: { [key: string]: string };

  // attempt to parse
  try {
    promptList = JSON.parse(result.content[0].text as string);
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(promptList).toBeTruthy();

  // verify we have tools named
  expect(Object.keys(promptList).length).toBeGreaterThan(0);

  // Call a tool
  const result2 = await CallMCPTool(MCP_TOOL_LOOKUP.GET_PROMPT, {
    name: promptList[0],
  });

  // make result2 the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result2.content as any[])?.length).toEqual(1);

  // validate we get a string back
  expect(typeof result.content[0].text).toEqual('string');
};
