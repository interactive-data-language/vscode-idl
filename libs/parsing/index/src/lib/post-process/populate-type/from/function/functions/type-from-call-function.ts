import { CallFunctionToken } from '@idl/tokenizer';
import { IDL_TYPE_LOOKUP } from '@idl/types/idl-data-types';
import { IParsed, TreeToken } from '@idl/types/syntax-tree';

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
  const type = TypeFromFirstArg(index, parsed, token);
  return type && type !== IDL_TYPE_LOOKUP.ANY ? type : undefined;
}
