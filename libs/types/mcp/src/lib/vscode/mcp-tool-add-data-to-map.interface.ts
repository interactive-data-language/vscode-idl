import { IDLNotebookEmbeddedItem, IDLNotebookMap } from '@idl/types/notebooks';

import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Tool name for adding geo data to a map in the chat
 */
export type MCPTool_AddDataToMap = 'add-data-to-map';

/**
 * Layer type the LLM wants to add
 */
export type MCPToolParam_AddDataToMap_LayerType =
  | 'geojson'
  | 'raster'
  | 'vector';

/**
 * Parameters for adding geo data to a map
 */
export interface MCPToolParams_AddDataToMap {
  /** Raw GeoJSON string (required when layerType is 'geojson') */
  geojson?: string;
  /** Human-readable name for the layer */
  layerName?: string;
  /** Type of layer to add */
  layerType: MCPToolParam_AddDataToMap_LayerType;
  /** Fully-qualified URI to a raster or vector file (required when layerType is 'raster' or 'vector') */
  uri?: string;
}

/**
 * Response from add-data-to-map
 */
export interface MCPToolResponse_AddDataToMap
  extends IMCPToolVSCode_BaseResponse {
  /**
   * Structured map embed data ready for rendering.
   * Present only when success is true.
   */
  mapData?: IDLNotebookEmbeddedItem<IDLNotebookMap>;
}
