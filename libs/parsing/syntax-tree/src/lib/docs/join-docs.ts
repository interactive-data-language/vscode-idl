import { IDL_PROBLEM_CODES, SyntaxProblems } from '@idl/parsing/problem-codes';
import { CommentToken, NOT_EMPTY_LINE_REGEX } from '@idl/parsing/tokenizer';

import { IBasicBranch } from '../branches.interface';
import { SyntaxProblemWithTranslation } from '../syntax-problem-with';
import { MakeSpaces } from './make-spaces';

/**
 * Intelligently joins documentation together so that we don't have too many
 * empty lines and new line characters.
 *
 * Important because markdown gets goofy if we have more than one space and this
 * prevents too many new lines
 */
export function JoinDocs(
  docThis: string[],
  comments: IBasicBranch<CommentToken>[],
  syntax: SyntaxProblems
) {
  // return if nothing
  if (docThis.length === 0) {
    return '';
  }

  /** Where do our docs start at */
  const start = docThis[0].length - docThis[0].trimStart().length;

  /** Track empty lines we process */
  let empty = 0;
  let code = false;

  /** strings that we keep */
  const keep: string[] = [];

  // filter multi-empty lines not in code blocks
  for (let i = 0; i < docThis.length; i++) {
    // validate the start of the line to alert user if docs
    // are not aligned
    if (i > 0) {
      const match = NOT_EMPTY_LINE_REGEX.exec(docThis[i]);
      if (match !== null) {
        if (match.index < start) {
          // automatically fix the text, if we format our docs it will be
          // corrected when we save
          docThis[i] = `${MakeSpaces(start - match.index)}${docThis[i]}`;

          // make pos if we have a comment
          if (comments[i] !== undefined) {
            syntax.push(
              SyntaxProblemWithTranslation(
                IDL_PROBLEM_CODES.DOCS_NOT_LEFT_ALIGNED,
                comments[i].pos,
                comments[i].pos
              )
            );
          }
        }
      }
    }

    // trim to the same start and remove white space from the right
    const trimmed = docThis[i].substring(start).trimEnd();

    // check for code block
    const isCode = trimmed.startsWith('```');

    // check if we encounter a code block
    if (isCode) {
      // reset counter
      empty = 0;

      // flip our flag
      code = !code;
    }

    // skip code lines
    if (code) {
      keep.push(trimmed);
      continue;
    }

    // increment empty counter
    if (!trimmed) {
      if (empty === 0) {
        // save one line with spaces in case users have custom formatting
        keep.push('');
      }

      empty += 1;

      // if more than one, skip
      if (empty > 1) {
        continue;
      }
    } else {
      // reset empty counter
      empty = 0;

      // save line
      keep.push(trimmed);
    }
  }

  // if the last line is empty remove it
  if (keep.length > 0) {
    if (keep[keep.length - 1] === '') {
      keep.pop();
    }
  }

  // return our strings
  return keep.length > 0 ? keep.join(`\n`) : '';
}
