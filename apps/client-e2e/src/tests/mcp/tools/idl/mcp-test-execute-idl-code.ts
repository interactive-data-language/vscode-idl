import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_ExecuteIDLCode,
  MCPToolResponse_VSCode,
} from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure we can start IDL through MCP
 */
export const RunMCPTestExecuteIDLCode: RunnerFunction = async (init) => {
  /**
   * Run code that completes
   */
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE, {
    code: `print, 'foo'`,
  });

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // verify we started
  expect(init.debug.adapter.isStarted()).toBeTruthy();

  // parse result
  const parsed = JSON.parse(
    result.content[0].text
  ) as MCPToolResponse_VSCode<MCPTool_ExecuteIDLCode>;

  // make sure we have "foo" as the cleaned text
  expect(CleanIDLOutput(parsed.idlOutput)).toEqual('foo');

  /**
   * Run code that fails
   *
   * a and b are undefined
   */
  const runtimeError = await CallMCPTool(MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE, {
    code: `foo = a + b`,
  });

  expect(runtimeError.isError).toBeTruthy();

  // parse result
  const parsedRuntimeError = JSON.parse(
    runtimeError.content[0].text
  ) as MCPToolResponse_VSCode<MCPTool_ExecuteIDLCode>;

  // make sure we catch in the IDL MCP tool
  expect(parsedRuntimeError.success).toBeFalsy();

  // make sure we have "foo" as the cleaned text
  expect(
    CleanIDLOutput(parsedRuntimeError.idlOutput)
      .toLowerCase()
      .startsWith('% variable is undefined')
  ).toBeTruthy();

  /**
   * Run code with a syntax error
   */
  const syntaxError = await CallMCPTool(MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE, {
    code: `help, 42 + `,
  });

  expect(syntaxError.isError).toBeTruthy();

  // parse result
  const parsedSyntaxError = JSON.parse(
    syntaxError.content[0].text
  ) as MCPToolResponse_VSCode<MCPTool_ExecuteIDLCode>;

  // make sure we catch in the IDL MCP tool
  expect(parsedSyntaxError.success).toBeFalsy();

  // make sure we have "foo" as the cleaned text
  expect(
    CleanIDLOutput(parsedSyntaxError.err || '')
      .toLowerCase()
      .includes(' compilation error(s)')
  ).toBeTruthy();
};
