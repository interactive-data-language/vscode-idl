import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Make sure that we can search for routines using the "all" type
 */
export const RunMCPTestSearchForRoutineAll: RunnerFunction = async (init) => {
  // Call a tool
  const routineSearch = await CallMCPTool(MCP_TOOL_LOOKUP.SEARCH_FOR_ROUTINE, {
    routines: [
      {
        name: 'plot',
        type: 'All',
      },
    ],
  });

  // make sure the tool runs
  expect(routineSearch.isError).toBeFalsy();

  // verify we get one block of content back
  expect(routineSearch.content.length).toEqual(1);

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
  expect(routineMatches.length).toEqual(1);

  // make sure the number of keys for the first entry is 6 (all fields)
  // this test will need to be updated if the MCP server chagnes
  expect(Object.keys(routineMatches[0]).length).toEqual(6);
};

/**
 * Makes sure we can search for a single type of routine
 */
export const RunMCPTestSearchForRoutineSingle: RunnerFunction = async (
  init,
) => {
  // Call a tool
  const routineSearch = await CallMCPTool(MCP_TOOL_LOOKUP.SEARCH_FOR_ROUTINE, {
    routines: [
      {
        name: 'plot',
        type: 'Function',
      },
    ],
  });

  // make sure the tool runs
  expect(routineSearch.isError).toBeFalsy();

  // verify we get one block of content back
  expect(routineSearch.content.length).toEqual(1);

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
  expect(routineMatches.length).toEqual(1);

  // verify one match for first search
  expect(Object.keys(routineMatches[0]).length).toEqual(1);
};

/**
 * Makes sure we can search for a single type of routine
 */
export const RunMCPTestSearchForRoutineMultiple: RunnerFunction = async (
  init,
) => {
  // Call a tool
  const routineSearch = await CallMCPTool(MCP_TOOL_LOOKUP.SEARCH_FOR_ROUTINE, {
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
  });

  // make sure the tool runs
  expect(routineSearch.isError).toBeFalsy();

  // verify we get one block of content back
  expect(routineSearch.content.length).toEqual(1);

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
  expect(routineMatches.length).toEqual(2);

  // verify one match for first search
  expect(Object.keys(routineMatches[0]).length).toEqual(1);

  // make sure the number of keys for the first entry is 6 (all fields)
  // this test will need to be updated if the MCP server chagnes
  expect(Object.keys(routineMatches[1]).length).toEqual(6);
};
