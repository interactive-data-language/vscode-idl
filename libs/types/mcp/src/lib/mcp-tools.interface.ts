import { IMCPBaseResponse as IMCPTool_BaseResponse } from './mcp-base-response.interface';

/**
 * Message when running change detection in ENVI
 */
export type MCPTool_ENVIChangeDetection = 'envi-change-detection';

/**
 * Parameters when running change detection in ENVI
 */
export interface MCPToolParams_ENVIChangeDetection {
  /**
   * Time 1 raster
   */
  time1Uri: string;
  /**
   * Time 2 raster
   */
  time2Uri: string;
}

/**
 * Response when running change detection in ENVI
 */
export type MCPToolResponse_ENVIChangeDetection = IMCPTool_BaseResponse;

/**
 * Message when opening an image in ENVI
 */
export type MCPTool_OpenInENVI = 'open-in-envi';

/**
 * Parameters for opening an image in ENVI
 */
export interface MCPToolParams_OpenInENVI {
  /**
   * Do we display the image or not?
   */
  display: boolean;
  /**
   * The file to open
   */
  uri: string;
}

/**
 * Response for opening an image in ENVI
 */
export type MCPResponse_OpenInENVI = IMCPTool_BaseResponse;

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
export type MCPToolResponse_StartENVI = IMCPTool_BaseResponse;

/**
 * Types of MCP messages
 */
export type MCPTools =
  | MCPTool_ENVIChangeDetection
  | MCPTool_OpenInENVI
  | MCPTool_StartENVI;

/**
 * Payloads for all MCP messages
 */
export type MCPToolParams<T extends MCPTools> =
  T extends MCPTool_ENVIChangeDetection
    ? MCPToolParams_ENVIChangeDetection
    : T extends MCPTool_OpenInENVI
    ? MCPToolParams_OpenInENVI
    : T extends MCPTool_StartENVI
    ? MCPToolParams_StartENVI
    : never;

/**
 * Payloads for all MCP messages
 */
export type MCPToolResponse<T extends MCPTools> =
  T extends MCPTool_ENVIChangeDetection
    ? MCPToolResponse_ENVIChangeDetection
    : T extends MCPTool_OpenInENVI
    ? MCPResponse_OpenInENVI
    : T extends MCPTool_StartENVI
    ? MCPToolResponse_StartENVI
    : never;

/**
 * Strictly typed messages that we can send back and forth
 */
interface IMCPToolLookup {
  /** Run change detection in ENVI */
  ENVI_CHANGE_DETECTION: MCPTool_ENVIChangeDetection;
  /** Open a dataset in ENVI */
  OPEN_IN_ENVI: MCPTool_OpenInENVI;
  /** Start ENVI */
  START_ENVI: MCPTool_StartENVI;
}

/**
 * Lookup with types of messages
 */
export const MCP_TOOL_LOOKUP: IMCPToolLookup = {
  ENVI_CHANGE_DETECTION: 'envi-change-detection',
  OPEN_IN_ENVI: 'open-in-envi',
  START_ENVI: 'start-envi',
};
