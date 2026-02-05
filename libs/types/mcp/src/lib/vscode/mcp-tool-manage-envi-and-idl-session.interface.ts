import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Manage ENVI and IDL Session
 */
export type MCPTool_ManageENVIAndIDLSession = 'manage-envi-and-idl-session';

/**
 * Action to take on the ENVI and IDL session
 */
export type MCPToolParams_ManageENVIAndIDLSession_Action =
  | 'restart-envi-headless'
  | 'restart-envi-ui'
  | 'restart-idl'
  | 'stop';

/**
 * Parameters for managing ENVI and IDL session
 */
export interface MCPToolParams_ManageENVIAndIDLSession {
  /**
   * Action to take on the session
   *
   * - "stop": Stops the current ENVI and IDL session
   * - "restart-idl": Restarts IDL
   * - "restart-envi-ui": Restarts ENVI and IDL with the UI displayed
   * - "restart-envi-headless": Restarts ENVI and IDL in headless mode (no UI)
   */
  action: MCPToolParams_ManageENVIAndIDLSession_Action;
}

/**
 * Response for managing ENVI and IDL session
 */
export interface MCPToolResponse_ManageENVIAndIDLSession
  extends IMCPToolVSCode_BaseResponse {
  /** Output from IDL */
  idlOutput?: string;
}
