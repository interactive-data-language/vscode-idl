import { IMCPToolIDL_BaseResponse } from '../mcp-base-response.interface';

/**
 * Control ENVI and IDL Session
 */
export type MCPTool_ControlIDLAndENVISession = 'control-idl-and-envi-session';

/**
 * Action to take on the ENVI and IDL session
 */
export type MCPToolParams_ControlIDLAndENVISession_Action =
  // | 'restart-envi-headless'
  | 'restart-envi'
  | 'restart-idl'
  // | 'start-envi-headless'
  | 'start-envi'
  | 'start-idl'
  | 'stop';

/**
 * Parameters for controlling ENVI and IDL session
 */
export interface MCPToolParams_ControlIDLAndENVISession {
  /**
   * Action to take on the session
   *
   * Action enums are self-descriptive
   */
  action: MCPToolParams_ControlIDLAndENVISession_Action;
}

/**
 * Response for controlling ENVI and IDL session
 */
export type MCPToolResponse_ControlIDLAndENVISession = IMCPToolIDL_BaseResponse;
