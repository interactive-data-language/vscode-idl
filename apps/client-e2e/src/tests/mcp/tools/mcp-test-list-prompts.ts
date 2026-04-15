import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../runner.interface';
import { CallMCPTool } from '../helpers/call-mcp-tool';

/**
 * Makes sure we can list all prompts
 */
export const RunMCPTestListAllPrompts: RunnerFunction = async (init) => {
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
};

/**
 * Makes sure we can list prompts with filters
 */
export const RunMCPTestListPromptsWithFilters: RunnerFunction = async (
  init,
) => {
  // Call a tool
  const resultIDL = await CallMCPTool(MCP_TOOL_LOOKUP.LIST_PROMPTS, {
    filter: 'idl',
  });

  // make sure the tool runs
  expect(resultIDL.isError).toBeFalsy();

  // make sure the tool runs
  expect((resultIDL.content as any[])?.length).toEqual(1);

  // Call a tool
  const resultsENVI = await CallMCPTool(MCP_TOOL_LOOKUP.LIST_PROMPTS, {
    filter: 'envi',
  });

  // make sure the tool runs
  expect(resultsENVI.isError).toBeFalsy();

  // make sure the tool runs
  expect((resultsENVI.content as any[])?.length).toEqual(1);
};
