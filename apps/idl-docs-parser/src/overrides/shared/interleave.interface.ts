import {
  IParameterOrPropertyDetails,
  ParseIDLType,
} from '@idl/data-types/core';

/**
 * The type for interleave
 */
export const INTERLEAVE_TYPE = ParseIDLType('bil | bip | bsq');

/**
 * Interleave data type
 */
export const INTERLEAVE_IN_ARG_KW: Partial<IParameterOrPropertyDetails> = {
  direction: 'in',
  type: INTERLEAVE_TYPE,
};

/**
 * Output interleave argument
 */
export const INTERLEAVE_OUT_ARG_KW: Partial<IParameterOrPropertyDetails> = {
  direction: 'out',
  type: INTERLEAVE_TYPE,
};
