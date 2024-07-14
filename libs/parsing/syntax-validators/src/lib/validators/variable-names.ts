import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithoutTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_PROBLEM_CODES, ISyntaxProblem } from '@idl/types/problem-codes';

import { RESERVED_WORDS } from '../reserved.interface';

/**
 * Verify variable names
 */
IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(
  TOKEN_NAMES.VARIABLE,
  (token, parsed) => {
    // get our variable name
    const match = token.match[0].toLowerCase();

    // initialize problem
    let problem: ISyntaxProblem;

    // determine if we have a problem
    switch (true) {
      case match in RESERVED_WORDS:
        // make our problem
        token.parseProblems.push(IDL_PROBLEM_CODES.RESERVED_VARIABLE);
        problem = SyntaxProblemWithoutTranslation(
          IDL_PROBLEM_CODES.RESERVED_VARIABLE,
          `"${match}" ${
            IDL_TRANSLATION.parsing.errors[IDL_PROBLEM_CODES.RESERVED_VARIABLE]
          }`,
          token.pos,
          token.pos
        );
        break;
      default:
        // do nothing
        break;
    }

    // save our problem if we have one
    if (problem !== undefined) {
      parsed.parseProblems.push(problem);
    }
  }
);
