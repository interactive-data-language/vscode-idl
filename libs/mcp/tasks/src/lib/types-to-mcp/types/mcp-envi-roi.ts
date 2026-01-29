import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

/**
 * Returns an ENVI ROI task parameter for an ENVI Task MCP
 * Tool
 */
export function MCP_ENVIROI(description: string) {
  return z
    .object({
      factory: z
        .string()
        .default('URLROI')
        .refine((val) => val.toLowerCase() === 'urlroi', {
          message: 'factory must be "URLROI" (case-insensitive)',
        })
        .describe('This value should be "URLROI" (case-insensitive)'),
      url: z
        .string()
        .describe(
          `Provide a fully-qualified filepath to an ENVI ROI file. Should end with an ".xml" extension.`
        ),
      dataset_index: z
        .number()
        .describe(
          `If an ROI file has more than one ROI, optionally specify the zero-based index of which ROI you want. The tool ${MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI} returns an array of matches and their dehydrated versions to help.`
        )
        .optional(),
    })
    .describe(description);
}
