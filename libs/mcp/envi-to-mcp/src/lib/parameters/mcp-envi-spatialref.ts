import { z } from 'zod';

import { MCP_ENVIPseudoRasterSpatialref } from './mcp-envi-pseudo-raster-spatialref';
import { MCP_ENVIRPCRasterSpatialref } from './mcp-envi-rpc-raster-spatialref';
import { MCP_ENVIStandardRasterSpatialref } from './mcp-envi-standard-raster-spatialref';

/**
 * Creates an ENVI spatial reference
 */
export function MCP_ENVISpatialref() {
  return z.union([
    MCP_ENVIPseudoRasterSpatialref(),
    MCP_ENVIRPCRasterSpatialref(),
    MCP_ENVIStandardRasterSpatialref(),
  ]);
}
