import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';
import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithoutTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { ExtractDisabledProblems } from '../helpers/extract-disabled-problems';

/**
 * Regex to extract TODO statements
 */
const TODO_REGEX = /^TODO:/im;

/**
 * Extract TODO statements from comments
 */
IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(
  TOKEN_NAMES.COMMENT,
  (token, parsed, meta) => {
    /**
     * Remove leading comment
     */
    const sub = token.match[0].substring(1).trim();

    // make sure we have a TODO which means three capture groups
    // see comments.spec.ts for some examples
    if (TODO_REGEX.test(sub)) {
      token.parseProblems.push(IDL_PROBLEM_CODES.TODO);
      parsed.parseProblems.push(
        SyntaxProblemWithoutTranslation(
          IDL_PROBLEM_CODES.TODO,
          `TODO: ${sub.substring(5).trim()}`,
          token.pos,
          token.pos
        )
      );
    }

    // check for disabled problems that we need to remove
    ExtractDisabledProblems(sub, token, parsed, meta.localParent);
  }
);