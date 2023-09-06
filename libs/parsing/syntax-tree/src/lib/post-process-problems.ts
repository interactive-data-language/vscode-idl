import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';

import { IParsed } from './build-syntax-tree.interface';

/**
 * Post process syntax problems to clean up reporting.
 *
 * Primarily to neatly report problems when we have an unclosed token
 * which breaks all syntax parsing.
 */
export function PostProcessProblems(tokenized: IParsed) {
  /** Get syntax problems */
  const syntax = tokenized.parseProblems;

  /** Track line number of unclosed token */
  let unclosedLine = -1;
  /** ID of the problem that was not closed */
  let unclosedEnd = -1;

  // process to find unclosed
  for (let i = 0; i < syntax.length; i++) {
    if (syntax[i].code === IDL_PROBLEM_CODES.NOT_CLOSED) {
      unclosedLine = syntax[i].start[0];
      unclosedEnd = syntax[i].start[1] + syntax[i].start[2];
      break;
    }
  }

  // filter distracting/potentially incorrect syntax problems
  if (unclosedLine !== -1) {
    /** Track indices to remove */
    let toRemove: number[] = [];

    // process all tokens
    for (let i = 0; i < syntax.length; i++) {
      // check if on a line after unclosed
      let after = syntax[i].start[0] > unclosedLine;

      // check for same line, but afterwards
      if (!after) {
        if (syntax[i].start[0] === unclosedLine) {
          after = unclosedEnd <= syntax[i].start[1];
        }
      }

      // save if problem is after or if we have a main level missing end
      if (after || syntax[i].code === IDL_PROBLEM_CODES.MISSING_MAIN_END) {
        toRemove.push(i);
      }
    }

    // reverse
    toRemove = toRemove.reverse();

    // remove all
    for (let i = 0; i < toRemove.length; i++) {
      syntax.splice(toRemove[i], 1);
    }
  }
}
