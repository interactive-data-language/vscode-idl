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
 * Message when we want to run IDL code
 */
export type MCPTool_ExecuteIDLCode = 'execute-idl-code';

/**
 * Parameters for running IDL code
 */
export interface MCPToolParams_ExecuteIDLCode {
  /**
   * Do we display the image or not?
   */
  code: string;
}

/**
 * Response for running IDL code
 */
export interface MCPToolResponse_ExecuteIDLCode extends IMCPTool_BaseResponse {
  /** output from IDL */
  idlOutput?: string;
}

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
export type MCPToolResponse_OpenInENVI = IMCPTool_BaseResponse;

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
 * Message when start IDL
 */
export type MCPTool_StartIDL = 'start-idl';

/**
 * Payload for starting IDL
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MCPToolParams_StartIDL {}

/**
 * Response for starting IDL
 */
export type MCPToolResponse_StartIDL = IMCPTool_BaseResponse;

/**
 * Types of MCP messages
 */
export type MCPTools =
  | MCPTool_ENVIChangeDetection
  | MCPTool_ExecuteIDLCode
  | MCPTool_OpenInENVI
  | MCPTool_StartENVI
  | MCPTool_StartIDL;

/**
 * Payloads for all MCP messages
 */
export type MCPToolParams<T extends MCPTools> =
  T extends MCPTool_ENVIChangeDetection
    ? MCPToolParams_ENVIChangeDetection
    : T extends MCPTool_ExecuteIDLCode
    ? MCPToolParams_ExecuteIDLCode
    : T extends MCPTool_OpenInENVI
    ? MCPToolParams_OpenInENVI
    : T extends MCPTool_StartENVI
    ? MCPToolParams_StartENVI
    : T extends MCPTool_StartIDL
    ? MCPToolParams_StartIDL
    : never;

/**
 * Payloads for all MCP messages
 */
export type MCPToolResponse<T extends MCPTools> =
  T extends MCPTool_ENVIChangeDetection
    ? MCPToolResponse_ENVIChangeDetection
    : T extends MCPTool_ExecuteIDLCode
    ? MCPToolResponse_ExecuteIDLCode
    : T extends MCPTool_OpenInENVI
    ? MCPToolResponse_OpenInENVI
    : T extends MCPTool_StartENVI
    ? MCPToolResponse_StartENVI
    : T extends MCPTool_StartIDL
    ? MCPToolResponse_StartIDL
    : never;

/**
 * Strictly typed messages that we can send back and forth
 */
interface IMCPToolLookup {
  /** Run change detection in ENVI */
  ENVI_CHANGE_DETECTION: MCPTool_ENVIChangeDetection;
  /** Run code in IDL */
  EXECUTE_IDL_CODE: MCPTool_ExecuteIDLCode;
  /** Open a dataset in ENVI */
  OPEN_IN_ENVI: MCPTool_OpenInENVI;
  /** Start ENVI */
  START_ENVI: MCPTool_StartENVI;
  /** Start IDL */
  START_IDL: MCPTool_StartIDL;
}

/**
 * Lookup with types of messages
 */
export const MCP_TOOL_LOOKUP: IMCPToolLookup = {
  ENVI_CHANGE_DETECTION: 'envi-change-detection',
  EXECUTE_IDL_CODE: 'execute-idl-code',
  OPEN_IN_ENVI: 'open-in-envi',
  START_ENVI: 'start-envi',
  START_IDL: 'start-idl',
};
