import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

/**
 * Track tokens to ignore (things that are allowed)
 */
const IGNORE: { [key: string]: boolean } = {};
IGNORE[TOKEN_NAMES.COMMENT] = true;
IGNORE[TOKEN_NAMES.COMMENT_BLOCK] = true;

/**
 * Check for bad tokens after line continuations
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.LINE_CONTINUATION,
  (token, parsed) => {
    // init flag if we found something besides comments
    let found = false;

    // get number of children and process in reverse
    const n = token.kids.length;

    // init value for end pos
    let end = token.end.pos;

    // process all children
    let j: number;
    for (let i = 0; i < n; i++) {
      // update reverse index
      j = n - i - 1;

      // check if we ignore the child
      if (!(token.kids[j].name in IGNORE)) {
        // if first time hitting this, then update the end of our error
        if (!found) {
          end = token.kids[j].pos;
        }

        // update flag
        found = true;

        // track problem for our unknown token
        token.kids[j].parseProblems.push(
          IDL_PROBLEM_CODES.ILLEGAL_AFTER_LINE_CONTINUATION
        );
      }
    }

    // check if we have a problem or not
    if (found) {
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.ILLEGAL_AFTER_LINE_CONTINUATION,
          token.pos,
          end
        )
      );
    }
  }
);
