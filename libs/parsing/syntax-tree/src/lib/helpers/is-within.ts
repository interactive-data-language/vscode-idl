import { PositionArray } from '@idl/types/tokenizer';
import { Position } from 'vscode-languageserver';

/**
 * Checks if a token is before another token
 */
export function IsBeforeToken(pos: PositionArray, comp: PositionArray) {
  switch (true) {
    case pos[0] < comp[0]:
      return true;
    case pos[0] > comp[0]:
      return false;
    default:
      return pos[1] + pos[2] - 1 < comp[1];
  }
}

/**
 * Checks if VSCode position is within a token PositionArray
 */
export function IsWithinToken(pos: Position, comp: PositionArray) {
  // make sure we are on the same line
  if (pos.line !== comp[0]) {
    return false;
  }

  // favoring left means the token to our left gets an extra space, otherwise
  // only the normal extent
  return comp[1] <= pos.character && comp[1] + comp[2] >= pos.character;
}

/**
 * Checks if our cursor is within the bounds of a token's start and end
 *
 * Used because, although we might not have a direct match for a selected token,
 * we are still within a parent token
 */
export function IsWithinBranch(
  pos: Position,
  start: PositionArray,
  end: PositionArray
) {
  switch (true) {
    // same line
    case start[0] === end[0]:
      return IsWithinToken(pos, [
        start[0],
        start[1],
        end[1] + end[2] - start[1],
      ]);
    // in start or end
    case IsWithinToken(pos, start) || IsWithinToken(pos, end):
      return true;
    // in lines between start and end
    case pos.line > start[0] && pos.line < end[0]:
      return true;
    default:
      return false;
  }
}
