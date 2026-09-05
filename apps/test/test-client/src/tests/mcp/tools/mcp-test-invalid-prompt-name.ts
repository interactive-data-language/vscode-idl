import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../runner.interface';
import { CallMCPTool } from '../helpers/call-mcp-tool';

/** Prompt name we will never have */
const FAKE_NAME = '!~\\-Hello. My name is Inigo Montoya.-/~!';

/**
 * Makes sure MCP tool fails when we have ENVI Tool Workflows that don't exist
 */
export const RunMCPTestInvalidPromptName: RunnerFunction = async (init) => {
  // query parameters fail
  const result1 = await CallMCPTool(MCP_TOOL_LOOKUP.GET_PROMPT, {
    name: FAKE_NAME,
  });

  // make sure the tool runs
  expect(result1.isError).toBeTruthy();
};
