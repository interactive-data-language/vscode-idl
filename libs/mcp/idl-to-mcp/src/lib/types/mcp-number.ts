import { z } from 'zod';

/**
 * Creates an MCP parameter from a number
 */
export function MCP_Number(values?: string[], min?: number, max?: number) {
  /**
   * Attempt to convert choice list to literal numbers as we
   * store literal numbers as strings (from parsing)
   */
  if (values?.length > 0) {
    try {
      return z.union(values.map((v) => z.literal(+v)) as any);
    } catch (err) {
      console.warn(err);
    }
  }

  // init result
  let res = z.number();

  // check for min
  if (typeof min !== 'undefined') {
    res = res.min(min);
  }

  // check for max
  if (typeof max !== 'undefined') {
    res = res.max(max);
  }

  return res;
}
