import { z } from 'zod';

import { ENVI_FILE_EXTENSION_LOOKUP } from '../envi-file-extension.interface';
import { FACTORY_LOOKUP } from '../fix-envi-factory';

FACTORY_LOOKUP['urlpointcloud'] = 'URLPointCloud';

ENVI_FILE_EXTENSION_LOOKUP['urlpointcloud'] = '.las';

/**
 * Returns an ENVI Point Cloud task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVIPointCloud() {
  return z.object({
    factory: z.literal('URLPointCloud'),
    url: z
      .array(z.string())
      .describe(
        `Provide a fully-qualified filepath to point cloud files on disk. The file should end in ".las" or ".laz" or point to an existing ENVI LiDAR project for an ".ini" file.`,
      ),
  });
}
