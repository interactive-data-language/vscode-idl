import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when querying a dataset for more information
 */
export type MCPTool_QueryDatasetWithENVI = 'query-dataset-with-envi';

/**
 * Parameters for opening an image in ENVI
 */
export interface MCPToolParams_QueryDatasetWithENVI {
  /**
   * Dehydrated form of the dataset we want to query
   */
  dataset: { [key: string]: any };
}

/**
 * Response for querying an image with ENVI
 */
export interface MCPToolResponse_QueryDatasetWithENVI
  extends IMCPToolVSCode_BaseResponse {
  /** Information about the dataset that we return to the agent, array of values */
  info: { [key: string]: any }[];
}
