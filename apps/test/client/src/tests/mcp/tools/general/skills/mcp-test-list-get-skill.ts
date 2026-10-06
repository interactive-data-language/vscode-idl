import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { GetTextContent } from '../../../helpers/get-text-content';

/**
 * Makes sure we can list skills and get a skill by name
 */
export const RunMCPTestListGetSkill: RunnerFunction = async (init) => {
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

  const skillNames = Object.keys(skillList);

  // verify we have skills named
  expect(skillNames.length).toBeGreaterThan(0);

  // Call a tool to get the first skill
  const result2 = await CallMCPTool(MCP_TOOL_LOOKUP.GET_SKILL, {
    name: skillNames[0],
  });

  // make sure result2 runs
  expect(result2.isError).toBeFalsy();

  // make sure the tool runs
  expect((result2.content as any[])?.length).toEqual(1);

  // validate we get a non-empty string back
  const textContent = GetTextContent(result2.content);
  expect(typeof textContent).toEqual('string');
  expect(textContent.length).toBeGreaterThan(0);
};
