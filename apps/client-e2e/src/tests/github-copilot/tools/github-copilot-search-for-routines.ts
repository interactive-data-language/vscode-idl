import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../runner.interface';
import { CallMCPTool } from '../helpers/call-mcp-tool';

/**
 * Makes sure we error when we get resources
 *
 * resources-workflow tests this working
 */
export const RunGitHubCopilotSearchForRoutine: RunnerFunction = async (
  init
) => {
  // Call a tool
  const plotSearchAll = await CallMCPTool(
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
  expect(plotSearchAll.isError).toBeFalsy();

  // verify we get one block of content back
  expect(plotSearchAll.content.length).toBe(1);

  // init variable
  let plotAllRoutineMatches: { [key: string]: string[] }[];

  // attempt to parse
  try {
    plotAllRoutineMatches = JSON.parse(plotSearchAll.content[0].text as string);
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(plotAllRoutineMatches).toBeTruthy();

  // verify one set of matches returned
  expect(plotAllRoutineMatches.length).toBe(1);

  console.log(JSON.stringify(plotAllRoutineMatches, undefined, 2));
};
