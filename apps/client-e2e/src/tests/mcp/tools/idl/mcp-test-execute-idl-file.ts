import { GetExtensionPath } from '@idl/idl/files';
import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_ExecuteIDLFile,
  MCPToolResponse_VSCode,
} from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';
import {
  LogWhenExpectError,
  LogWhenExpectSuccess,
} from '../../helpers/test-loggers';

/**
 * Makes sure we can start IDL through MCP
 */
export const RunMCPTestExecuteIDLFile: RunnerFunction = async (init) => {
  /**
   * Run a file that works correctly
   */
  const resSuccess = await CallMCPTool(MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE, {
    uri: GetExtensionPath(
      'idl/test/client-e2e/copilot/mcp/idl-file-runs-fine.pro'
    ),
  });

  LogWhenExpectSuccess(resSuccess);

  // make sure error is reported in MCP response
  expect(resSuccess.isError).toBeFalsy();

  // parse result
  const parsedSuccess = JSON.parse(
    resSuccess.content[0].text
  ) as MCPToolResponse_VSCode<MCPTool_ExecuteIDLFile>;

  // verify we returned a success flag
  expect(parsedSuccess.success).toBeTruthy();

  // make sure we have "foo" as the cleaned text
  expect(CleanIDLOutput(parsedSuccess.idlOutput)).toEqual('foo');

  /**
   * Run a file that has a runtime error
   */
  const resRuntimeErr = await CallMCPTool(MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE, {
    uri: GetExtensionPath(
      'idl/test/client-e2e/copilot/mcp/idl-file-runtime-error.pro'
    ),
  });

  LogWhenExpectError(resRuntimeErr);

  // make sure the tool runs
  expect(resRuntimeErr.isError).toBeTruthy();

  // verify we started
  expect(init.debug.adapter.isStarted()).toBeTruthy();

  // parse result
  const parsedRuntimeErr = JSON.parse(
    resRuntimeErr.content[0].text
  ) as MCPToolResponse_VSCode<MCPTool_ExecuteIDLFile>;

  // verify we returned a success flag
  expect(parsedRuntimeErr.success).toBeFalsy();

  /**
   * Run a file with syntax errors
   */
  const resSyntaxErr = await CallMCPTool(MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE, {
    uri: GetExtensionPath(
      'idl/test/client-e2e/copilot/mcp/idl-file-syntax-error.pro'
    ),
  });

  LogWhenExpectError(resSyntaxErr);

  // make sure error is reported in MCP response
  expect(resSyntaxErr.isError).toBeTruthy();

  // parse result
  const parsedSyntaxErr = JSON.parse(
    resSyntaxErr.content[0].text
  ) as MCPToolResponse_VSCode<MCPTool_ExecuteIDLFile>;

  // verify we returned a success flag
  expect(parsedSyntaxErr.success).toBeFalsy();
};
