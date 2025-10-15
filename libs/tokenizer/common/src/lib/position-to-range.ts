import { PositionArray } from '@idl/types/tokenizer';
import { Range } from 'vscode-languageserver';

/**
 * Convert a token position to a range
 */
export function PositionToRange(
  pos: PositionArray,
  end?: PositionArray
): Range {
  // check if we have a range to range-ify
  if (end) {
    return {
      start: {
        line: pos[0],
        character: pos[1],
      },
      end: {
        line: end[0],
        character: end[1] + end[2],
      },
    };
  }

  return {
    start: {
      line: pos[0],
      character: pos[1],
    },
    end: {
      line: pos[0],
      character: pos[1] + pos[2],
    },
  };
}
