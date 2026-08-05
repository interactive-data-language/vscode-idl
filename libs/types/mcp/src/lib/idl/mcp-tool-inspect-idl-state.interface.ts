import { IMCPToolIDL_BaseResponse } from '../mcp-base-response.interface';

// name for server.
export type MCPTool_InspectIDLState = 'inspect-idl-state';

//list of actions.
export type InspectIDLStateAction =
  | 'get-info'
  | 'get-variables'
  | 'get-stack'
  | 'get-output'
  | 'get-errors'
  | 'get-coverage';

// Parameters for inspecting IDL state
export interface MCPToolParams_InspectIDLState {
  action: InspectIDLStateAction;
  //defaults to current frame (0)
  frameId?: number;
  // File path required for get-coverage
  file?: string;
}

// response type for inspecting IDL state
export type MCPToolResponse_InspectIDLState = IMCPToolIDL_BaseResponse<any>;
