import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Manage ENVI and IDL Session
 */
export type MCPTool_ManageIDLAndENVISession = 'manage-idl-and-envi-session';

/**
 * Action to take on the ENVI and IDL session
 */
export type MCPToolParams_ManageIDLAndENVISession_Action =
  | 'restart-envi-headless'
  | 'restart-envi'
  | 'restart-idl'
  | 'start-envi-headless'
  | 'start-envi'
  | 'start-idl'
  | 'stop';

/**
 * Parameters for managing ENVI and IDL session
 */
export interface MCPToolParams_ManageIDLAndENVISession {
  /**
   * Action to take on the session
   *
   * Action enums are self-descriptive
   */
  action: MCPToolParams_ManageIDLAndENVISession_Action;
}

/**
 * Response for managing ENVI and IDL session
 */
export interface MCPToolResponse_ManageIDLAndENVISession
  extends IMCPToolVSCode_BaseResponse {
  /** Output from IDL */
  idlOutput?: string;
}
