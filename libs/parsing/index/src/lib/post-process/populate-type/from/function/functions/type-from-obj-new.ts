import { CallFunctionToken } from '@idl/tokenizer';
import { IParsed, TreeToken } from '@idl/types/syntax-tree';

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
