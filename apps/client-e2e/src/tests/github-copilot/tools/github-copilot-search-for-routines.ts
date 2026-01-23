import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../runner.interface';
import { CallMCPTool } from '../helpers/call-mcp-tool';

/**
 * Make sure that we can search for routines using the "all" type
 */
export const RunGitHubCopilotSearchForRoutineAll: RunnerFunction = async (
  init
) => {
  // Call a tool
  const routineSearch = await CallMCPTool(
    MCP_TOOL_LOOKUP.RESOURCES_SEARCH_FOR_ROUTINE,
    {
      routines: [
        {
          name: 'plot',
          type: 'All',
        },
      ],
    }
  );

  // make sure the tool runs
  expect(routineSearch.isError).toBeFalsy();

  // verify we get one block of content back
  expect(routineSearch.content.length).toBe(1);

  // init variable
  let routineMatches: { [key: string]: string[] }[];

  // attempt to parse
  try {
    routineMatches = JSON.parse(routineSearch.content[0].text as string);
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(routineMatches).toBeTruthy();

  // verify one set of matches returned
  expect(routineMatches.length).toBe(1);

  // make sure the number of keys for the first entry is 6 (all fields)
  // this test will need to be updated if the MCP server chagnes
  expect(Object.keys(routineMatches[0]).length).toBe(6);
};

/**
 * Makes sure we can search for a single type of routine
 */
export const RunGitHubCopilotSearchForRoutineSingle: RunnerFunction = async (
  init
) => {
  // Call a tool
  const routineSearch = await CallMCPTool(
    MCP_TOOL_LOOKUP.RESOURCES_SEARCH_FOR_ROUTINE,
    {
      routines: [
        {
          name: 'plot',
          type: 'Function',
        },
      ],
    }
  );

  // make sure the tool runs
  expect(routineSearch.isError).toBeFalsy();

  // verify we get one block of content back
  expect(routineSearch.content.length).toBe(1);

  // init variable
  let routineMatches: { [key: string]: string[] }[];

  // attempt to parse
  try {
    routineMatches = JSON.parse(routineSearch.content[0].text as string);
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(routineMatches).toBeTruthy();

  // verify one set of matches returned
  expect(routineMatches.length).toBe(1);

  // verify one match for first search
  expect(Object.keys(routineMatches[0]).length).toBe(1);
};

/**
 * Makes sure we can search for a single type of routine
 */
export const RunGitHubCopilotSearchForRoutineMultiple: RunnerFunction = async (
  init
) => {
  // Call a tool
  const routineSearch = await CallMCPTool(
    MCP_TOOL_LOOKUP.RESOURCES_SEARCH_FOR_ROUTINE,
    {
      routines: [
        {
          name: 'plot',
          type: 'Function',
        },
        {
          name: 'csv',
          type: 'All',
        },
      ],
    }
  );

  // make sure the tool runs
  expect(routineSearch.isError).toBeFalsy();

  // verify we get one block of content back
  expect(routineSearch.content.length).toBe(1);

  // init variable
  let routineMatches: { [key: string]: string[] }[];

  // attempt to parse
  try {
    routineMatches = JSON.parse(routineSearch.content[0].text as string);
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(routineMatches).toBeTruthy();

  // verify one set of matches returned
  expect(routineMatches.length).toBe(2);

  // verify one match for first search
  expect(Object.keys(routineMatches[0]).length).toBe(1);

  // make sure the number of keys for the first entry is 6 (all fields)
  // this test will need to be updated if the MCP server chagnes
  expect(Object.keys(routineMatches[1]).length).toBe(6);
};
