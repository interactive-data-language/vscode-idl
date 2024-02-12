import { IParameterOrPropertyDetails } from '@idl/types/core';

import { CleanDocs } from './clean-docs';
import { GetTypeBadge } from './get-type-badge';

/**
 * From a property, creates docs
 */
export function DocsForProperty(prop: IParameterOrPropertyDetails) {
  return `### ${
    prop.display
  } {prop-${prop.display.toLowerCase()}}\n\n${GetTypeBadge(
    prop.type
  )}\n\n${CleanDocs(prop.docs)}\n\n`;
}
