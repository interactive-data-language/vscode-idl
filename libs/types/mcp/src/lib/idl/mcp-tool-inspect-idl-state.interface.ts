import { IMCPToolIDL_BaseResponse } from '../mcp-base-response.interface';

// name for server.
export type MCPTool_InspectIDLState = 'inspect-idl-state';

// list of actions.
export type InspectIDLStateAction =
  | 'get-coverage'
  | 'get-errors'
  | 'get-info'
  | 'get-output'
  | 'get-stack'
  | 'get-variables';

// Parameters for inspecting IDL state
export interface MCPToolParams_InspectIDLState {
  action: InspectIDLStateAction;
  // File path required for get-coverage
  file?: string;
  // defaults to current frame (0)
  frameId?: number;
}

// response type for inspecting IDL state
export type MCPToolResponse_InspectIDLState = IMCPToolIDL_BaseResponse<any>;
