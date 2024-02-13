import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
import { IParameterLookup } from '@idl/types/core';

/**
 * Normalizes arguments
 */
export async function NormalizeArgs(lookup: IParameterLookup) {
  /**
   * Get all keywords
   */
  const args = Object.values(lookup);

  // update display names
  for (let i = 0; i < args.length; i++) {
    args[i].display = TransformCase(args[i].display, STYLE_FLAG_LOOKUP.CAMEL);
  }
}
