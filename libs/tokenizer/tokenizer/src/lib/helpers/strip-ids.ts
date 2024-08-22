import deepCopy from 'fast-copy';

import {
  IBaseTokenWithoutMatches,
  TokenizerToken,
} from '../tokenizer.interface';
import { TokenName } from '../tokens.interface';

/**
 * Copies tokens and strips out any ID fields they may have.
 *
 * That was we can easier compare tokens for testing.
 */
export function StripIDs(
  tokens: TokenizerToken<TokenName>[],
  removeMatches = false
) {
  // copy our tokens
  const copied = deepCopy(tokens);

  // strip unrelated fields
  for (let i = 0; i < copied.length; i++) {
    delete (copied[i] as any)._id;
    if (removeMatches) {
      delete (copied[i] as any).matches;
    }
  }

  // return as our new type
  return copied as IBaseTokenWithoutMatches<TokenName>[];
}
