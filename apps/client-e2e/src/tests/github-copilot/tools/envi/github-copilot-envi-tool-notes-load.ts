import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure ENVI tool notes load
 *
 * We get 3 items back when ntoes are present, 2 when no notes
 */
export const RunGitHubCopilotENVIToolNotesLoad: RunnerFunction = async (
  init
) => {
  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.ENVI_GET_TOOL_PARAMETERS, {
    taskName: 'ISODataClassification',
  });

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(3);
};
