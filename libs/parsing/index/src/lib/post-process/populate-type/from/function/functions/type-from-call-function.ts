import { TreeToken } from '@idl/parsing/syntax-tree';
import { CallFunctionToken } from '@idl/parsing/tokenizer';

import { EvaluateToken } from '../../../evaluate/evaluate-token';

/**
 * Return the name of the function being called from a `call_function` function
 * call
 *
 */
export function TypeFromCallFunction(
  token: TreeToken<CallFunctionToken>
): string {
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
  return undefined;
}
