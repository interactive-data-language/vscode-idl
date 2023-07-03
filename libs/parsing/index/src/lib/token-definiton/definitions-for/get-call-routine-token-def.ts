import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/parsing/tokenizer';

import { GlobalIndexedToken } from '../../global-index.interface';
import { GetRoutine } from '../../helpers/get-routine';
import { IDLIndex } from '../../idl-index.class';
import { CACHE_FOR_TOKEN_DEF } from '../get-token-definition';

/**
 * Returns hover help for a routine that is being called
 *
 * Specifically, it is tokens in our code such as call procedure  or call
 * function
 */
export function GetCallRoutineTokenDef(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<TokenName>
): GlobalIndexedToken | undefined {
  // initialize help
  const global = GetRoutine(index, parsed, token, CACHE_FOR_TOKEN_DEF);

  return global.length > 0 ? global[0] : undefined;
}
