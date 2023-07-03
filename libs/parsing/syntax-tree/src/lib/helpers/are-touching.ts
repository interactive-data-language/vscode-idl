import { PositionArray } from '@idl/parsing/tokenizer-types';

/**
 * Checks if the end of our first position lines up with the
 * start of our second position
 */
export function AreTokensTouching(
  pos1: PositionArray,
  pos2: PositionArray
): boolean {
  // not on the same line
  if (pos1[0] !== pos2[0]) {
    return false;
  }

  return pos1[1] + pos1[2] === pos2[1];
}
