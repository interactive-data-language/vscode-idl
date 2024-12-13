export interface JSONRPCNotification {
  /**
   * A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0".
   */
  jsonrpc: '2.0';
  /**
   * Method to run
   */
  method: string;
  /**
   * Parameters passed in
   */
  params?: any;
}

export interface JSONRPCRequest extends JSONRPCNotification {
  /**
   * An identifier established by the Client that MUST contain a
   * String, Number, or NULL value if included. If it is not included it is assumed to be a
   * notification. The value SHOULD normally not be Null [1] and Numbers SHOULD NOT contain
   * fractional parts [2]
   */
  id: number;
}

export interface IJSONRPCError {
  /** Code for the error */
  code: number;
  /** Error message information */
  message: string;
  /** Additional information about the error */
  data?: any;
}

export interface JSONRPCResponse {
  /**
   * A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0".
   */
  jsonrpc: '2.0';
  /**
   * This member is REQUIRED on success.
   * This member MUST NOT exist if there was an error invoking the method.
   * The value of this member is determined by the method invoked on the Server.
   */
  result?: any;
  /**
   * This member is REQUIRED on error.
   * This member MUST NOT exist if there was no error triggered during invocation.
   * The value for this member MUST be an Object as defined in section 5.1.
   */
  error?: IJSONRPCError;
  /**
   * This member is REQUIRED.
   * It MUST be the same as the value of the id member in the Request Object.
   * If there was an error in detecting the id in the Request object (e.g. Parse error/Invalid Request), it MUST be Null.
   */
  id: number;
}
