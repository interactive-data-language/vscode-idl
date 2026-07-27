/** Parameters from ENVI report */
export type ENVIMCPToolResponse<TResult = string> = {
  /** Output from IDL */
  idlOutput?: string;
} & (ENVIMCPToolResponse_Failure | ENVIMCPToolResponse_Success<TResult>);

/** Parameters from ENVI report */
export interface ENVIMCPToolResponse_Success<TResult = string> {
  /** Success response, likely array, object, string, or combination of each */
  result: TResult;
  /** If we succeeded or not */
  success: true;
}

/** Parameters from ENVI report */
export interface ENVIMCPToolResponse_Failure {
  /** Success response, likely array, object, string, or combination of each */
  result: {
    /** Full reason why error, may be empty string */
    err: string;
    /** Short reason why error, may be empty string */
    reason?: string;
  };
  /** If we succeeded or not */
  success: false;
}

export const DEFAULT_ENVI_MCP_TOOL_RESPONSE: ENVIMCPToolResponse = {
  success: false,
  result: { err: 'Did not receive a response as expected' },
};
