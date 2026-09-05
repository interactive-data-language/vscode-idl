import { MCPToolHTTPResponse, MCPTools } from '@idl/types/mcp';

/**
 * If we expect success, and get an error, log the MCP response
 */
export function LogWhenExpectSuccess(result: MCPToolHTTPResponse<MCPTools>) {
  if (result.isError) {
    console.log(JSON.stringify(result, undefined, 2));
  }
}

/**
 * If we expect failure, and get success, log the MCP response
 */
export function LogWhenExpectError(result: MCPToolHTTPResponse<MCPTools>) {
  if (!result.isError) {
    console.log(JSON.stringify(result, undefined, 2));
  }
}
