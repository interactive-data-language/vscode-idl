import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { CallFunctionToken } from '@idl/tokenizer';

import { IDLIndex } from '../../../../../idl-index.class';
import { TypeFromFirstArg } from '../../helpers/type-from-first-arg';

/**
 * Attempt to determine the type from object new using the first child
 *
 * TODO: Check for known object classes/definitions
 *
 */
export function TypeFromObjNew(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallFunctionToken>
): string {
  return TypeFromFirstArg(index, parsed, token);
}
