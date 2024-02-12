import { IParameterOrPropertyDetails } from '@idl/types/core';

import { GetTypeBadge } from './get-type-badge';

/**
 * From a property, creates docs
 */
export function DocsForProperty(prop: IParameterOrPropertyDetails) {
  return `### ${prop.display} ${GetTypeBadge(
    prop.type
  )} {#prop-${prop.display.toLowerCase()}}\n\n${prop.docs}\n\n`;
}
