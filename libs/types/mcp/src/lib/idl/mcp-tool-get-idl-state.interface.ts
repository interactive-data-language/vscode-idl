import { IMCPToolIDL_BaseResponse } from '../mcp-base-response.interface';

// name for server.
export type MCPTool_GetIDLState = 'get-idl-state';

// list of actions.
export type GetIDLStateAction =
  | 'get-coverage'
  | 'get-errors'
  | 'get-info'
  | 'get-output'
  | 'get-stack'
  | 'get-variables';

// Parameters for getting IDL state
export interface MCPToolParams_GetIDLState {
  action: GetIDLStateAction;
  // File path required for get-coverage
  file?: string;
  // defaults to current frame (0)
  frameId?: number;
}

// response type for getting IDL state
export type MCPToolResponse_GetIDLState = IMCPToolIDL_BaseResponse<any>;
