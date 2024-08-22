import { TokenStartMatches } from '../token-matches.interface';
import { TokenName } from '../tokens.interface';

/**
 * Helper function that returns the array elements from regex matches.
 *
 * It returns the elements so we don't have the baggage of index, input, groups
 * which we don't need to save.
 *
 * This helps reduce data we store/pass around.
 */
export function GetMatchesArray<T extends TokenName>(
  match: RegExpExecArray
): TokenStartMatches<T> {
  const res: string[] = [];
  for (let i = 0; i < match.length; i++) {
    if (match[i] === undefined) {
      continue;
    }
    // res.push(match[i].trim());
    res.push(match[i]);
  }
  return res as TokenStartMatches<T>;
}
