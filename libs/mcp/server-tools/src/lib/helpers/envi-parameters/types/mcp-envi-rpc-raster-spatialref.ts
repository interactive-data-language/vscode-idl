import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

/**
 * Returns an ENVI RPC Raster Spatial Reference task parameter for an ENVI Task MCP Tool
 */
export function MCPENVIRPCRasterSpatialref(description: string) {
  return z
    .object({
      factory: z
        .literal('RPCRasterSpatialRef')
        .describe('This value should always be "RPCRasterSpatialRef"'),
      coord_sys_code: z
        .number()
        .int()
        .optional()
        .describe(`The EPSG code for the coordinate system`),
      coord_sys_str: z
        .string()
        .optional()
        .describe(
          'Geographic (GEOGCS) or projected (PROJCS) coordinate system string.'
        ),
      pixel_size: z
        .tuple([z.number(), z.number()])
        .optional()
        .describe(
          'Pixel size [X Pixel Size, Y Pixel Size] in coordinate system units.'
        ),
      rpc_line_den_coeff: z
        .array(z.number())
        .length(20)
        .describe('20 RPC line denominator coefficients.'),
      rpc_line_num_coeff: z
        .array(z.number())
        .length(20)
        .describe('20 RPC line numerator coefficients.'),
      rpc_offsets: z
        .array(z.number())
        .length(5)
        .describe(
          'Five RPC offsets: [Line_Offset, Sample_Offset, Latitude_Offset, Longitude_Offset, Height_Offset].'
        ),
      rpc_samp_den_coeff: z
        .array(z.number())
        .length(20)
        .describe('20 RPC sample denominator coefficients.'),
      rpc_samp_num_coeff: z
        .array(z.number())
        .length(20)
        .describe('20 RPC sample numerator coefficients.'),
      rpc_scales: z
        .array(z.number())
        .length(5)
        .describe(
          'Five RPC scales: [Line_Scale, Sample_Scale, Latitude_Scale, Longitude_Scale, Height_Scale].'
        ),
    })
    .describe(
      `${description}\n\nTo fetch the spatial reference for a dataset, use the "spatialref" property returned from the "${MCP_TOOL_LOOKUP.ENVI_QUERY_DATASET}" tool. However, rasters may not always have this type of spatial reference.`
    );
}
