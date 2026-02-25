import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';
import { LogWhenExpectSuccess } from '../../helpers/test-loggers';

/**
 * Makes sure we can list ENVI's tools and that we have more
 * than 200 available
 */
export const RunMCPTestListENVITools: RunnerFunction = async (init) => {
  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS, {});

  // log
  LogWhenExpectSuccess(result);

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(1);

  // init variable
  let toolsList: { [key: string]: string };

  // attempt to parse
  try {
    toolsList = JSON.parse(
      (result.content[0].text as string).replace(/^All tools: /, '')
    );
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(toolsList).toBeTruthy();

  // make sure we have an object first
  expect(typeof toolsList).toEqual('object');

  // verify we have more than 200 tools
  expect(Object.keys(toolsList).length).toBeGreaterThan(200);
};
