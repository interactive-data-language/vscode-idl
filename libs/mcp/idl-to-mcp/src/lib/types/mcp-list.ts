import { z } from 'zod';

/**
 * Creates an MCP list parameter
 */
export function MCP_List() {
  return z.array(z.any());
}
