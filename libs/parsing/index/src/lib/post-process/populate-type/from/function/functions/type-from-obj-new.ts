import { TreeToken } from '@idl/parsing/syntax-tree';
import { CallFunctionToken } from '@idl/parsing/tokenizer';
import { IDL_TYPE_LOOKUP } from '@idl/types/core';

import { EvaluateToken } from '../../../evaluate/evaluate-token';

/**
 * Attempt to determine the type from object new using the first child
 *
 * TODO: Check for known object classes/definitions
 *
 */
export function TypeFromObjNew(token: TreeToken<CallFunctionToken>): string {
  // get children
  const kids = token.kids;

  switch (true) {
    case kids.length > 0: {
      const value = EvaluateToken(kids[0]);
      if (value !== undefined) {
        return value;
      }
      break;
    }
    default:
      break;
  }

  // unsure, so return default task
  return IDL_TYPE_LOOKUP.ANY;
}
