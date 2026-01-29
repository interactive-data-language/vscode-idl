import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure invalid input parameters cause tool execution to fail
 */
export const RunGitHubCopilotENVIToolParameterValidation: RunnerFunction =
  async (init) => {
    const result = await CallMCPTool(MCP_TOOL_LOOKUP.RUN_ENVI_TOOL, {
      taskName: 'ISODataClassification',
      inputParameters: {},
      interactive: false,
    });

    // make sure the tool fails
    expect(result.isError).toBeTruthy();
  };
