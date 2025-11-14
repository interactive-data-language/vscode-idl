import { z } from 'zod';

/**
 * Returns an ENVI Raster task parameter for an ENVI Task MCP
 * Tool
 */
export function MCPENVIPointCloud(description: string) {
  return z
    .object({
      factory: z
        .literal('URLPointCloud')
        .describe('This value should always be "URLPointCloud"'),
      url: z
        .array(z.string())
        .describe(
          `Provide a fully-qualified filepath to point cloud files on disk. The file should end in ".las" or ".laz" or point to an existing ENVI LiDAR project for an ".ini" file.`
        ),
    })
    .describe(description);
}
