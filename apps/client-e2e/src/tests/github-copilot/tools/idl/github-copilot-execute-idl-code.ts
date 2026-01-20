import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import { Sleep } from '@idl/shared/extension';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_IDLExecuteCode,
  MCPToolResponse_VSCode,
} from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure we can start IDL through MCP
 */
export const RunGitHubCopilotExecuteIDLCode: RunnerFunction = async (init) => {
  /**
   * Run code that completes
   */
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.IDL_EXECUTE_CODE, {
    code: `print, 'foo'`,
  });

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // verify we started
  expect(init.debug.adapter.isStarted()).toBeTruthy();

  // parse result
  const parsed = JSON.parse(
    result.content[0].text
  ) as MCPToolResponse_VSCode<MCPTool_IDLExecuteCode>;

  // make sure we have "foo" as the cleaned text
  expect(CleanIDLOutput(parsed.idlOutput)).toEqual('foo');

  /**
   * Run code that fails
   *
   * a and b are undefined
   */
  const resError = await CallMCPTool(MCP_TOOL_LOOKUP.IDL_EXECUTE_CODE, {
    code: `foo = a + b`,
  });

  expect(resError.isError).toBeTruthy();

  // parse result
  const parsedError = JSON.parse(
    result.content[0].text
  ) as MCPToolResponse_VSCode<MCPTool_IDLExecuteCode>;

  // make sure we catch in the IDL MCP tool
  expect(parsedError.success).toBeFalsy();

  // make sure we have "foo" as the cleaned text
  expect(
    CleanIDLOutput(parsedError.idlOutput)
      .toLowerCase()
      .startsWith('% variable is undefined')
  ).toBeTruthy();

  await Sleep(5000);
};
