import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure we error when we get resources
 *
 * resources-workflow tests this working
 */
export const RunMCPTestSearchResources: RunnerFunction = async (init) => {
  // Call a tool
  const searchNoQuery = await CallMCPTool(MCP_TOOL_LOOKUP.SEARCH_RESOURCES, {
    queries: [],
  });

  // make sure the tool runs
  expect(searchNoQuery.isError).toBeFalsy();

  // verify we get one block of content back
  expect(searchNoQuery.content.length).toEqual(1);

  // init variable
  let noQueryResourcesrces: string[];

  // attempt to parse
  try {
    noQueryResourcesrces = JSON.parse(searchNoQuery.content[0].text as string);
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(noQueryResourcesrces).toBeTruthy();

  // make sure no matches since no queries
  expect(noQueryResourcesrces.length).toEqual(0);

  // Call a tool
  const functonResources = await CallMCPTool(MCP_TOOL_LOOKUP.SEARCH_RESOURCES, {
    queries: ['function'],
  });

  // make sure the tool runs
  expect(functonResources.isError).toBeFalsy();

  // verify we get one block of content back
  expect(functonResources.content.length).toEqual(1);

  // init variable
  let parsedFunctionResources: string[];

  // attempt to parse
  try {
    parsedFunctionResources = JSON.parse(
      functonResources.content[0].text as string
    );
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(parsedFunctionResources).toBeTruthy();

  // make sure no matches since no queries
  expect(parsedFunctionResources.length).toBeGreaterThan(0);
};
