import { z } from 'zod';

/**
 * Creates an MCP parameter from a string
 */
export function MCP_String(values?: string[]) {
  // check for values from a choice list and map to literals
  if (Array.isArray(values)) {
    return z.enum(values as [string, ...string[]]);
  } else {
    return z.string();
  }
}
