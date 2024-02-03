import { IDL_STRING_TYPE, IParameterOrPropertyDetails } from '@idl/types/core';

/**
 * URI parameters
 */
export const URI_ARG_KW: Partial<IParameterOrPropertyDetails> = {
  direction: 'in',
  type: IDL_STRING_TYPE,
  req: true,
};
