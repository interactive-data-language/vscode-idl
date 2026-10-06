import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';

/** Skill name we will never have */
const FAKE_NAME = '!~\\-Hello. My name is Inigo Montoya.-/~!';

/**
 * Makes sure MCP tool fails when we ask for a skill that doesn't exist
 */
export const RunMCPTestInvalidSkillName: RunnerFunction = async (init) => {
  // query parameters fail
  const result1 = await CallMCPTool(MCP_TOOL_LOOKUP.GET_SKILL, {
    name: FAKE_NAME,
  });

  // make sure the tool runs and returns error
  expect(result1.isError).toBeTruthy();
};
