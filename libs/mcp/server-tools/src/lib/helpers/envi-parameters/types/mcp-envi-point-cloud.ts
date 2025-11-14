import { z } from 'zod';

/**
 * Returns an ENVI Raster task parameter for an ENVI Task MCP
 * Tool
 */
export function MCPENVIPointCloud(description: string) {
  return z.object({
    factory: z
      .literal('URLPointCloud')
      .describe('This value should always be "URLPointCloud"'),
    url: z
      .array(z.string())
      .describe(
        `${description}\n\nIf a local file, provide a fully-qualified filepath to the dataset on disk.\n\nThe file should end in .las or .laz or an existing ENVI LiDAR project for an .ini file.`
      ),
  });
}
