import { z } from 'zod';

/**
 * Returns an ENVI GCP Set MCP parameter
 */
export function MCP_ENVIGCPSet() {
  return z.object({
    factory: z
      .string()
      .default('URLGCPSet')
      .refine((val) => val.toLowerCase() === 'urlgcpset', {
        message: 'factory must be "URLGCPSet" (case-insensitive)',
      })
      .describe('This value should be "URLGCPSet" (case-insensitive)'),
    url: z
      .string()
      .describe(
        `Provide a fully-qualified filepath to the GCP (Ground Control Points) file on disk. Should end with a ".pts" extension.`
      ),
  });
}
