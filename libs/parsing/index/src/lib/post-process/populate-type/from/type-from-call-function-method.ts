import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { CallFunctionMethodToken } from '@idl/parsing/tokenizer';
import {
  GlobalFunctionMethodToken,
  IDL_ANY_TYPE,
  IDLDataType,
  IGlobalIndexedToken,
} from '@idl/types/core';
import copy from 'fast-copy';

import { GetMethod } from '../../../helpers/get-method';
import { IDLIndex } from '../../../idl-index.class';
import { EvaluateReturnType } from './helpers/evaluate-return-type';

/**
 * Attempts to determine the type from system variables
 */
export function TypeFromCallFunctionMethod(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallFunctionMethodToken>
): IDLDataType {
  const methods: IGlobalIndexedToken<GlobalFunctionMethodToken>[] = GetMethod(
    index,
    parsed,
    token
  );

  // check if we found a method
  if (methods.length > 0) {
    return copy(EvaluateReturnType(index, parsed, token, methods[0]));
  } else {
    return copy(IDL_ANY_TYPE);
  }
}
