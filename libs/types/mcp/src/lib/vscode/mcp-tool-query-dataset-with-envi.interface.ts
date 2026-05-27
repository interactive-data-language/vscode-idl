import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when querying a dataset for more information
 */
export type MCPTool_QueryDatasetWithENVI = 'query-dataset-with-envi';

/**
 * Parameters for querying a dataset with ENVI
 */
export interface MCPToolParams_QueryDatasetWithENVI {
  /** An ENVI Deep Learning ONNX model (.envi.onnx) to query */
  deepLearningModel?: { [key: string]: any };
  /** An ENVI Machine Learning model (.json) to query */
  machineLearningModel?: { [key: string]: any };
  /** An ENVI Raster to query (e.g. .dat, .tif, .img) */
  raster?: { [key: string]: any };
  /** An ENVI ROI file (.xml) to query */
  roi?: { [key: string]: any };
  /** An ENVI spectral library (.sli) to query */
  spectralLibrary?: { [key: string]: any };
  /** An ENVI vector file (shapefile, .shp) to query */
  vector?: { [key: string]: any };
}

/**
 * Response for querying an image with ENVI
 */
export interface MCPToolResponse_QueryDatasetWithENVI
  extends IMCPToolVSCode_BaseResponse {
  /** Information about the dataset that we return to the agent, array of values */
  info: { [key: string]: any }[];
}
