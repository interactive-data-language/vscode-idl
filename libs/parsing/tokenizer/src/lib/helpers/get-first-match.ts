import { ITokenDef, TokenName } from '../tokens.interface';
import { IGetFirstMatch } from './get-first-match.interface';

/**
 * Checks our matches and returns the first one we find
 *
 * TODO: Can we optimize this by checking for closer first without needing to check all other
 * regular expressions (happens in find-tokens)
 */
export function GetFirstMatch(
  text: string,
  matches: RegExpExecArray[],
  closer?: ITokenDef<TokenName>
): IGetFirstMatch {
  /** For all regex matches, the string index of the first match */
  let minIdx = text.length + 1;

  /** For all regex matches, which match is the first */
  let idxFirst = -1;

  /** match we are processing */
  let match: RegExpExecArray;

  // process all of our matches
  for (let i = 0; i < matches.length; i++) {
    // extract our match
    match = matches[i];

    // if our match has an index of zero, stop iterating
    if (match.index === 0) {
      minIdx = match.index;
      idxFirst = i;
      break;
    }

    // check if we have a better nmatch
    if (match.index < minIdx) {
      minIdx = match.index;
      idxFirst = i;
    }
  }

  // check if we have a closer to look for
  if (closer !== undefined) {
    // const res = Match(text, closer.end, true);
    const res = closer.end.exec(text);

    // check if we found a match
    if (res !== null) {
      // if our closer has the same position as another match, them it wins
      // for example: variable assignment with a comment at the end
      if (res.index <= minIdx) {
        return { idxFirst: -1, closer: res };
      }
    }
  }

  return { idxFirst };
}
