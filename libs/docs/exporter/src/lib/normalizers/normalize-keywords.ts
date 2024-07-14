import { TransformCase } from '@idl/assembling/shared';
import { IParameterLookup } from '@idl/types/core';

import { CURRENT_CONFIG } from '../docs-exporter';

/**
 * Normalizes keywords
 */
export async function NormalizeKeywords(lookup: IParameterLookup) {
  /**
   * Get all keywords
   */
  const kws = Object.values(lookup);

  // update display names
  for (let i = 0; i < kws.length; i++) {
    kws[i].display = TransformCase(
      kws[i].display,
      CURRENT_CONFIG.style.keywords
    );
  }
}
