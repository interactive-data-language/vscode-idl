import { IMCPToolIDL_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when we want to query the IDL session
 */
export type MCPTool_QueryIDLSession = 'query-idl-session';

/**
 * Parameters for querying the IDL session
 */
export interface MCPToolParams_QueryIDLSession {
  /**
   * The IDL command to run.
   *
   * This runs in the same IDL session but does not echo
   * output to the user's debug console.
   */
  command: string;
}

/**
 * Response for querying the IDL session
 */
export type MCPToolResponse_QueryIDLSession = IMCPToolIDL_BaseResponse<any>;
