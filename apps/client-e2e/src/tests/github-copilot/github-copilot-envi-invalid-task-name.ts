import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../runner.interface';
import { CallMCPTool } from './helpers/call-mcp-tool';

/** Task name we will never have */
const FAKE_NAME = 'Hello. My name is Inigo Montoya.';

/**
 * Makes sure MCP tool fails when we have tasks that don't exist
 */
export const RunGitHubCopilotENVIInvalidTaskName: RunnerFunction = async (
  init
) => {
  // query parameters fail
  const result1 = await CallMCPTool(MCP_TOOL_LOOKUP.ENVI_GET_TOOL_PARAMETERS, {
    taskName: FAKE_NAME,
  });

  // make sure the tool runs
  expect(result1.isError).toBeTruthy();

  // running fails
  const result2 = await CallMCPTool(MCP_TOOL_LOOKUP.ENVI_RUN_TOOL, {
    taskName: FAKE_NAME,
    inputParameters: {},
    interactive: false,
  });

  // make sure the tool runs
  expect(result2.isError).toBeTruthy();
};
