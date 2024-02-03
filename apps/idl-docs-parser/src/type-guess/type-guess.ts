import { DEFAULT_DATA_TYPE } from '@idl/types/core';

import { TYPE_GUESS } from './type-guess.interface';

export const UNKNOWN_GUESSES: string[] = [];

/**
 * Parses the beginning of documentation using regular expressions to try and
 * determine the data type for a keyword, property, or an argument.
 */
export function TypeGuess(docs: string) {
  // return if no docs
  if (docs.trim() !== '') {
    // loop through all allowed types
    const types = Object.keys(TYPE_GUESS);
    for (let i = 0; i < types.length; i++) {
      const regexs = TYPE_GUESS[types[i]];
      for (let j = 0; j < regexs.length; j++) {
        if (regexs[j].test(docs)) {
          return types[i];
        }
      }
    }

    UNKNOWN_GUESSES.push(docs);
  }

  return DEFAULT_DATA_TYPE;
}
