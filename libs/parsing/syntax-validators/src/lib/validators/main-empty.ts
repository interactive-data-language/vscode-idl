import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Track tokens to ignore (things that are allowed)
 */
const IGNORE: { [key: string]: boolean } = {};
IGNORE[TOKEN_NAMES.COMMENT] = true;
IGNORE[TOKEN_NAMES.COMMENT_BLOCK] = true;

/**
 * Check for empty main level programs
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.MAIN_LEVEL,
  (token, parsed) => {
    // init flag if we found something besides comments
    let found = false;

    // process all children
    for (let i = 0; i < token.kids.length; i++) {
      // check for non-comment
      if (!(token.kids[i].name in IGNORE)) {
        found = true;
        break;
      }
    }

    // check if we have a problem or not
    if (!found) {
      token.parseProblems.push(IDL_PROBLEM_CODES.EMPTY_MAIN);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.EMPTY_MAIN,
          token.pos,
          token.end !== undefined ? token.end.pos : token.pos
        )
      );
    }
  }
);
