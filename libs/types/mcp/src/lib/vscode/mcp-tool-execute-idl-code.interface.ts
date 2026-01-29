import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when we want to run IDL code
 */
export type MCPTool_ExecuteIDLCode = 'execute-idl-code';

/**
 * Parameters for running IDL code
 */
export interface MCPToolParams_ExecuteIDLCode {
  /**
   * The code to run
   */
  code: string;
}

/**
 * Response for running IDL code
 */
export interface MCPToolResponse_ExecuteIDLCode
  extends IMCPToolVSCode_BaseResponse {
  /** Output from IDL */
  idlOutput?: string;
}
