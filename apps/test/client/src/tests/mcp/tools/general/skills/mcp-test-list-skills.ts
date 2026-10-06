import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { GetTextContent } from '../../../helpers/get-text-content';

/**
 * Makes sure we can list all skills
 */
export const RunMCPTestListAllSkills: RunnerFunction = async (init) => {
  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.LIST_SKILLS, {});

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(1);

  // init variable
  let skillList!: { [key: string]: string };

  // attempt to parse
  try {
    skillList = JSON.parse(GetTextContent(result.content));
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(skillList).toBeTruthy();

  // verify we have skills named
  expect(Object.keys(skillList).length).toBeGreaterThan(0);
};
