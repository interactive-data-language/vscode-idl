import { z } from 'zod';

import { MCP_ENVIAgCrops } from './mcp-envi-ag-crops';
import { MCP_ENVIAgZones } from './mcp-envi-ag-zones';
import { MCP_ENVIPointCloud } from './mcp-envi-point-cloud';
import { MCP_ENVIRaster } from './mcp-envi-raster';
import { MCP_ENVIRasterSeries } from './mcp-envi-raster-series';
import { MCP_ENVIROI } from './mcp-envi-roi';
import { MCP_ENVISpectralLibrary } from './mcp-envi-spectral-library';
import { MCP_ENVIVector } from './mcp-envi-vector';
import { MCP_SARscapeData } from './mcp-sarscape-data';

/**
 * Variant type (for edge cases)
 *
 * Technically can be anything, limiting to key ENVI types that
 * are datasets and not covered in other tools for publishing
 */
export function MCP_ENVIVariant() {
  return z.union([
    MCP_ENVIAgCrops(),
    MCP_ENVIAgZones(),
    MCP_ENVIPointCloud(),
    MCP_ENVIRaster(),
    MCP_ENVIRasterSeries(),
    MCP_ENVIROI(),
    MCP_ENVISpectralLibrary(),
    MCP_ENVIVector(),
    MCP_SARscapeData(),
  ]);
}
