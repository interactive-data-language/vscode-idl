import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when start ENVI
 */
export type MCPTool_StartENVI = 'start-envi';

/**
 * Payload for starting ENVI
 */
export interface MCPToolParams_StartENVI {
  /**
   * Do we display the UI or not?
   */
  headless: boolean;
}

/**
 * Response for starting ENVI
 */
export interface MCPToolResponse_StartENVI extends IMCPToolVSCode_BaseResponse {
  /** output from IDL */
  idlOutput?: string;
}
