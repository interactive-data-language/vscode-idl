import { IMCPToolIDL_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when querying a dataset for more information
 */
export type MCPTool_QueryDatasetWithENVI = 'query-dataset-with-envi';

/**
 * Parameters for querying a dataset with ENVI
 *
 * The dataset has already been resolved and validated by the MCP tool
 * logic, so a single dehydrated dataset is sent to IDL
 */
export interface MCPToolParams_QueryDatasetWithENVI {
  /** The dehydrated dataset to query */
  dataset: { [key: string]: any };
}

/**
 * Response for querying an image with ENVI
 *
 * On success, returns JSON metadata for the dataset
 */
export type MCPToolResponse_QueryDatasetWithENVI = IMCPToolIDL_BaseResponse<
  { [key: string]: any }[]
>;
