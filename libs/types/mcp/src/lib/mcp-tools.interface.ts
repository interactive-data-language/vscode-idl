import { IMCPBaseResponse } from './mcp-base-messages.interface';

/**
 * Message when running change detection in ENVI
 */
export type MCPENVIChangeDetection = 'envi-change-detection';

/**
 * Payload when running change detection in ENVI
 */
export interface MCPENVIChangeDetectionPayload {
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
export type MCPENVIChangeDetectionResponse = IMCPBaseResponse;

/**
 * Message when opening an image in ENVI
 */
export type MCPOpenInENVI = 'open-in-envi';

/**
 * Payload for opening an image in ENVI
 */
export interface MCPOpenInENVIPayload {
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
export type MCPOpenInENVIResponse = IMCPBaseResponse;

/**
 * Message when start ENVI
 */
export type MCPStartENVI = 'start-envi';

/**
 * Payload for starting ENVI
 */
export interface MCPStartENVIPayload {
  /**
   * Do we display the UI or not?
   */
  headless: boolean;
}

/**
 * Response for starting ENVI
 */
export type MCPStartENVIResponse = IMCPBaseResponse;

/**
 * Types of MCP messages
 */
export type MCPTools = MCPENVIChangeDetection | MCPOpenInENVI | MCPStartENVI;

/**
 * Payloads for all MCP messages
 */
export type MCPToolParams<T extends MCPTools> = T extends MCPENVIChangeDetection
  ? MCPENVIChangeDetectionPayload
  : T extends MCPOpenInENVI
  ? MCPOpenInENVIPayload
  : T extends MCPStartENVI
  ? MCPStartENVIPayload
  : never;

/**
 * Payloads for all MCP messages
 */
export type MCPToolResponse<T extends MCPTools> =
  T extends MCPENVIChangeDetection
    ? MCPENVIChangeDetectionResponse
    : T extends MCPOpenInENVI
    ? MCPOpenInENVIResponse
    : T extends MCPStartENVI
    ? MCPStartENVIResponse
    : never;

/**
 * Strictly typed messages that we can send back and forth
 */
interface IMCPToolLookup {
  /** Run change detection in ENVI */
  ENVI_CHANGE_DETECTION: MCPENVIChangeDetection;
  /** Open a dataset in ENVI */
  OPEN_IN_ENVI: MCPOpenInENVI;
  /** Start ENVI */
  START_ENVI: MCPStartENVI;
}

/**
 * Lookup with types of messages
 */
export const MCP_TOOL_LOOKUP: IMCPToolLookup = {
  ENVI_CHANGE_DETECTION: 'envi-change-detection',
  OPEN_IN_ENVI: 'open-in-envi',
  START_ENVI: 'start-envi',
};
