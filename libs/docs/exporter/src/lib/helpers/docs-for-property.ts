import { IParameterOrPropertyDetails } from '@idl/types/core';

import { CleanDocs } from './clean-docs';
import { CleanParamLink } from './clean-param-link';
import { GetTypeBadge } from './get-type-badge';

/**
 * From a property, creates docs
 */
export function DocsForProperty(prop: IParameterOrPropertyDetails) {
  return `### ${prop.display} {prop-${CleanParamLink(
    prop.display.toLowerCase()
  )}}\n\n${GetTypeBadge(prop.type)}\n\n${CleanDocs(prop.docs)}\n\n`;
}
