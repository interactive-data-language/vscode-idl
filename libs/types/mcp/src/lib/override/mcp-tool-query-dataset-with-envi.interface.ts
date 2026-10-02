/**
 * HTTP MCP Parameters for querying a dataset with ENVI
 *
 * Different from IDL because the parameters were adjusted to simplify
 * what an LLM needs to craft (there were issues with complex data type
 * expression)
 */
export interface MCPToolParamsOverride_QueryDatasetWithENVI {
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
