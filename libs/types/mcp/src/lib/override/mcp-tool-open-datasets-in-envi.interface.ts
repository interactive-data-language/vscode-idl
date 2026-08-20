import {
  ENVIRaster,
  ENVIRasterSeries,
  ENVIVector,
} from '@idl/types/envi/datasets';

import { MCPToolParams_HTTPOpenDatasetsInENVI_Base } from '../idl/mcp-tool-open-datasets-in-envi.interface';

interface WithOrder {
  /**
   * Order for the layer, lower-numbers are displayed first
   */
  order: number;
}

interface ENVIRasterWithOrder extends ENVIRaster, WithOrder {}

interface ENVIRasterSeriesWithOrder extends ENVIRasterSeries, WithOrder {}

interface ENVIVectorWithOrder extends ENVIVector, WithOrder {}

/**
 * HTTP MCP Parameters for opening a dataset in ENVI
 *
 * Different from IDL because the parameters were adjusted to simplify
 * what an LLM needs to craft (there were issues with complex data type
 * expression)
 */
export interface MCPToolParamsOverride_OpenDatasetsInENVI
  extends MCPToolParams_HTTPOpenDatasetsInENVI_Base {
  /**
   * Rasters to open
   */
  rasters?: ENVIRasterWithOrder[];
  /**
   * Raster series to open
   */
  rasterSeries?: ENVIRasterSeriesWithOrder[];
  /**
   * Vectors to open
   */
  vectors?: ENVIVectorWithOrder[];
}
