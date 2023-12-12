import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/parsing/tokenizer';

import { IDLIndex } from '../idl-index.class';
import { IFoundKeywords } from './get-keywords.interface';
import { GetRoutine } from './get-routine';
import { ITokenCache } from './token-cache.interface';

/**
 * Based on a specific token, we try to find a parent and the keywords that are
 * available for it.
 *
 * Returns an object with the keywords and a reference to our global token so
 * that you have source information.
 *
 * If no matching routine is found, it returns undefined.
 */
export function GetKeywords(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<TokenName>,
  useCache = true
): IFoundKeywords {
  if ('keywords' in (token.cache as ITokenCache) && useCache) {
    return (token.cache as ITokenCache).keywords;
  }

  /**
   * Get the routine we belong to
   */
  const global = GetRoutine(index, parsed, token, useCache);

  // check for matches
  if (global.length > 0) {
    (token.cache as ITokenCache).keywords = {
      keywords: global[0].meta.kws,
      global: global[0],
    };
    return (token.cache as ITokenCache).keywords;
  }

  (token.cache as ITokenCache).keywords = undefined;
  return (token.cache as ITokenCache).keywords;
}
