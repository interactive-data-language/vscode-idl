import { ITokenDef, TokenName } from '../tokens.interface';

/**
 * Finds matches for all regex expressions
 */
export function FindMatches(
  lineText: string, // full line
  text: string, // subset
  linePosition: number,
  foundDefs: ITokenDef<TokenName>[],
  matches: RegExpExecArray[],
  regex: ITokenDef<TokenName>[]
) {
  // clear previous matches - faster than setting length = 0
  foundDefs.splice(0, foundDefs.length);
  matches.splice(0, matches.length);

  // var for less GC since we will call this many times
  let found: RegExpExecArray;

  // process all expressions
  for (let i = 0; i < regex.length; i++) {
    // skip if we can only match at the beginning of the line
    if (
      regex[i].onlyFirst &&
      linePosition > 0 &&
      lineText.substring(0, linePosition).trim() !== ''
    ) {
      continue;
    }

    // find matches and reset any existing matches
    // found = Match(text, regex[i].start, true);
    found = regex[i].match.exec(text);
    if (found !== null) {
      // check for bad regex - error to prevent infinite loop
      if (found[0].length === 0) {
        throw new Error(
          `Regex for token "${regex[i].name}" produced a start with zero width. Not supported and causes errors with infinite loops`
        );
      }
      foundDefs.push(regex[i]);
      matches.push(found);
      if (found.index === 0) {
        break;
      }
    }
  }
}
