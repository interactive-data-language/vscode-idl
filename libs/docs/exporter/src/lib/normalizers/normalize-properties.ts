import { TransformCase } from '@idl/assembling/shared';
import { IParameterLookup } from '@idl/types/core';

import { CURRENT_CONFIG } from '../docs-exporter';

/**
 * Normalizes properties
 */
export async function NormalizeProperties(lookup: IParameterLookup) {
  /**
   * Get all keywords
   */
  const props = Object.values(lookup);

  // update display names
  for (let i = 0; i < props.length; i++) {
    props[i].display = TransformCase(
      props[i].display,
      CURRENT_CONFIG.style.properties
    );
  }
}
