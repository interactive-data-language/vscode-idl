import { IDetailedPosition, TokenizerToken } from '../tokenizer.interface';
import { TokenName } from '../tokens.interface';

/**
 * Internal function that erases a portion of a line
 */
function EraseText(line: string, location: IDetailedPosition) {
  // return if we have a zero-width match
  if (location.length === 0) {
    return line;
  }

  // make a new string to replace our text
  const newString = new Array(location.length).fill(' ').join('');

  // build our new string and return
  return (
    line.substring(0, location.index) +
    newString +
    line.substring(location.index + location.length)
  );
}

/**
 * Routine that processes a line of text and removes features at the
 * selected location.
 */
export function EraseToken(code: string[], token: TokenizerToken<TokenName>) {
  code[token.pos.line] = EraseText(code[token.pos.line], token.pos);
}
