import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when we want to run IDL code within a file
 */
export type MCPTool_ExecuteIDLFile = 'execute-idl-file';

/**
 * Parameters for running IDL code within a file
 */
export interface MCPToolParams_ExecuteIDLFile {
  /**
   * The fully-qualified path to the file to run
   */
  uri: string;
}

/**
 * Response for running IDL code within a file
 */
export interface MCPToolResponse_ExecuteIDLFile
  extends IMCPToolVSCode_BaseResponse {
  /** Output from IDL */
  idlOutput?: string;
}
