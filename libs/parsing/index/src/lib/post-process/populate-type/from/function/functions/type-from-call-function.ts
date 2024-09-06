import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { CallFunctionToken } from '@idl/tokenizer';

import { IDLIndex } from '../../../../../idl-index.class';
import { TypeFromFirstArg } from '../../helpers/type-from-first-arg';

/**
 * Return the name of the function being called from a `call_function` function
 * call
 *
 */
export function TypeFromCallFunction(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallFunctionToken>
): string {
  return TypeFromFirstArg(index, parsed, token);
}
