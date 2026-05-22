import { z } from 'zod';

/**
 * Creates an MCP parameter from a string
 */
export function MCP_String(values?: string[]) {
  // check for values from a choice list and map to literals
  if (Array.isArray(values)) {
    return z.union(values.map((v) => z.literal(v)) as any);
  } else {
    return z.string();
  }
}
