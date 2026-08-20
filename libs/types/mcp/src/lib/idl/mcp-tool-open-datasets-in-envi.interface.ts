import { IMCPToolIDL_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when opening an image in ENVI
 */
export type MCPTool_OpenDatasetsInENVI = 'open-datasets-in-envi';

/**
 * Base parameters for opening datasets in ENVI
 */
export interface MCPToolParams_HTTPOpenDatasetsInENVI_Base {
  /**
   * For a single dataset, do we zoom to the extent of the layer?
   *
   * If more than one, we zoom to the view's full extent.
   *
   * Make sure this matches logic in `vscode_displayDatasets` in IDL
   */
  automaticZoom: 'all-layers' | 'last-layer' | 'none';
  /**
   * Do we reset the display or not?
   */
  resetView: boolean;
}

/**
 * Parameters for opening an image in ENVI
 */
export interface MCPToolParams_OpenDatasetsInENVI
  extends MCPToolParams_HTTPOpenDatasetsInENVI_Base {
  /**
   * The dehydrated datasets to open
   */
  datasets: { [key: string]: any }[];
}

/**
 * Response for opening an image in ENVI
 *
 * On success, result is string saying datasets are open, nothing special
 * right now
 */
export type MCPToolResponse_OpenDatasetsInENVI =
  IMCPToolIDL_BaseResponse<string>;
