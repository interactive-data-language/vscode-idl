import { IParameterOrPropertyDetails } from '@idl/types/core';

import { CleanDocs } from './clean-docs';
import { CleanParamLink } from './clean-param-link';
import { GetDirectionBadge } from './get-direction-badge';
import { GetRequiredBadge } from './get-required-badge';
import { GetTypeBadge } from './get-type-badge';

/**
 * From a parameter (arg or keyword) create docs
 */
export function DocsForParameter(
  param: IParameterOrPropertyDetails,
  link: string
) {
  return `### ${param.display} {#${CleanParamLink(link)}}\n\n${GetRequiredBadge(
    param
  )}${GetDirectionBadge(param)}${GetTypeBadge(param.type)}\n\n${CleanDocs(
    param.docs
  )}\n\n`;
}
