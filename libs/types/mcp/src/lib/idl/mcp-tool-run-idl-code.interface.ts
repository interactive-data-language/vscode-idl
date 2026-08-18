import { IMCPToolIDL_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when we want to run IDL code
 */
export type MCPTool_RunIDLCode = 'run-idl-code';

/**
 * Parameters for running IDL code
 */
export interface MCPToolParams_RunIDLCode {
  /**
   * The code to run
   */
  code: string;
}

/**
 * Response for running IDL code
 */
export type MCPToolResponse_RunIDLCode = IMCPToolIDL_BaseResponse;
