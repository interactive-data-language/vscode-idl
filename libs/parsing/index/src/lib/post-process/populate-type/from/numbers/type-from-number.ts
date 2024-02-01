import { TreeToken } from '@idl/parsing/syntax-tree';
import { NumberToken } from '@idl/parsing/tokenizer';
import {
  IDL_BYTE_TYPE,
  IDL_DOUBLE_COMPLEX_TYPE,
  IDL_DOUBLE_TYPE,
  IDL_FLOAT_COMPLEX_TYPE,
  IDL_FLOAT_TYPE,
  IDL_INT_TYPE,
  IDL_LONG_TYPE,
  IDL_LONG64_TYPE,
  IDL_UINT_TYPE,
  IDL_ULONG_TYPE,
  IDL_ULONG64_TYPE,
  IDLDataType,
} from '@idl/types/core';
import copy from 'fast-copy';

import {
  BYTE_REGEX,
  COMPLEX_REGEX,
  DOUBLE_REGEX,
  EXPLICIT_FLOAT_REGEX,
  FLOAT_REGEX,
  INT_REGEX,
  LONG_REGEX,
  LONG64_REGEX,
  UINT_REGEX,
  ULONG_REGEX,
  ULONG64_REGEX,
} from './number-type-regex.interface';

/**
 * Attempts to determine the type from numbers
 */
export function TypeFromNumber(
  token: TreeToken<NumberToken>,
  compOptions: string[] = []
): IDLDataType {
  const match = token.match[0];

  // check for flags
  const double =
    compOptions.includes('idl3') || compOptions.includes('float64');
  const long =
    compOptions.includes('idl3') ||
    compOptions.includes('idl2') ||
    compOptions.includes('defint32');

  // check from highest to lowest type
  switch (true) {
    case DOUBLE_REGEX.test(match):
      if (COMPLEX_REGEX.test(match)) {
        return copy(IDL_DOUBLE_COMPLEX_TYPE);
      } else {
        return copy(IDL_DOUBLE_TYPE);
      }
    case FLOAT_REGEX.test(match):
      // check if we should promote to double
      if (!EXPLICIT_FLOAT_REGEX.test(match) && double) {
        if (COMPLEX_REGEX.test(match)) {
          return copy(IDL_DOUBLE_COMPLEX_TYPE);
        } else {
          return copy(IDL_DOUBLE_TYPE);
        }
      } else {
        if (COMPLEX_REGEX.test(match)) {
          return copy(IDL_FLOAT_COMPLEX_TYPE);
        } else {
          return copy(IDL_FLOAT_TYPE);
        }
      }
    // check if we added complex notation to a number, but it isnt double or
    // float, so we need to make it float complex minimally
    case COMPLEX_REGEX.test(match):
      if (double) {
        return copy(IDL_DOUBLE_COMPLEX_TYPE);
      } else {
        return copy(IDL_FLOAT_COMPLEX_TYPE);
      }
    case ULONG64_REGEX.test(match):
      return copy(IDL_ULONG64_TYPE);
    case LONG64_REGEX.test(match):
      return copy(IDL_LONG64_TYPE);
    case ULONG_REGEX.test(match):
      return copy(IDL_ULONG_TYPE);
    case LONG_REGEX.test(match):
      return copy(IDL_LONG_TYPE);
    case BYTE_REGEX.test(match):
      return copy(IDL_BYTE_TYPE);
    case UINT_REGEX.test(match):
      return copy(IDL_UINT_TYPE);
    case INT_REGEX.test(match):
      return copy(IDL_INT_TYPE);
    case long:
      return copy(IDL_LONG_TYPE);
    default:
      return copy(IDL_INT_TYPE);
  }
}
