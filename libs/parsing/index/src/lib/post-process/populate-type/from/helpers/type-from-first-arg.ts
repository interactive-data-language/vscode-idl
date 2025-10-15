import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import {
  CallFunctionToken,
  CallProcedureToken,
  TOKEN_NAMES,
} from '@idl/tokenizer';
import { IDL_TYPE_LOOKUP } from '@idl/types/core';

import { IDLIndex } from '../../../../idl-index.class';
import { EvaluateVariableOrToken } from './evaluate-variable-or-token';

/**
 * Returns the type from the first argument of a function or
 * procedure
 */
export function TypeFromFirstArg(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallFunctionToken | CallProcedureToken>
): string {
  // get children
  const kids = token.kids;

  // get arg from calling a function
  if (token.name === TOKEN_NAMES.CALL_FUNCTION) {
    switch (true) {
      case kids.length > 0: {
        const value = EvaluateVariableOrToken(index, parsed, kids[0]);
        if (value !== undefined) {
          return value;
        }
        break;
      }
      default:
        break;
    }
  } else {
    switch (true) {
      case kids.length > 1: {
        const value = EvaluateVariableOrToken(index, parsed, kids[1]);
        if (value !== undefined) {
          return value;
        }
        break;
      }
      default:
        break;
    }
  }

  // unsure, so return default task
  return IDL_TYPE_LOOKUP.ANY;
}
