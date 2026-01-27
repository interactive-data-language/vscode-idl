import { z } from 'zod';

/**
 * Returns an ENVI Raster task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVIPointCloud(description: string) {
  return z
    .object({
      factory: z
        .string()
        .default('URLPointCloud')
        .refine((val) => val.toLowerCase() === 'urlpointcloud', {
          message: 'factory must be "URLPointCloud" (case-insensitive)',
        })
        .describe('This value should be "URLPointCloud" (case-insensitive)'),
      url: z
        .array(z.string())
        .describe(
          `Provide a fully-qualified filepath to point cloud files on disk. The file should end in ".las" or ".laz" or point to an existing ENVI LiDAR project for an ".ini" file.`
        ),
    })
    .describe(description);
}
