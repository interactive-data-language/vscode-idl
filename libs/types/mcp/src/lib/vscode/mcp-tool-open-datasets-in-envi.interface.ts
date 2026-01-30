import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when opening an image in ENVI
 */
export type MCPTool_OpenDatasetsInENVI = 'open-datasets-in-envi';

/**
 * Parameters for opening an image in ENVI
 */
export interface MCPToolParams_OpenDatasetsInENVI {
  /**
   * For a single dataset, do we zoom to the extent of the layer?
   *
   * If more than one, we zoom to the view's full extent.
   *
   * Make sure this matches logic in `vscode_displayDatasets` in IDL
   */
  automaticZoom: 'all-layers' | 'last-layer' | 'none';
  /**
   * The dehydrated datasets to open
   */
  datasets: { [key: string]: any }[];
  /**
   * Do we reset the display or not?
   */
  resetView: boolean;
}

/**
 * Response for opening an image in ENVI
 */
export interface MCPToolResponse_OpenDatasetsInENVI
  extends IMCPToolVSCode_BaseResponse {
  /** output from IDL */
  idlOutput?: string;
}
