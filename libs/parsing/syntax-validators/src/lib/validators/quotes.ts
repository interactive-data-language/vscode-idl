import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Make sure double quotes are closed
 */
IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(
  TOKEN_NAMES.QUOTE_DOUBLE,
  (token, parsed) => {
    if (!token.match[0].endsWith(`"`)) {
      token.parseProblems.push(IDL_PROBLEM_CODES.UNCLOSED_QUOTE);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.UNCLOSED_QUOTE,
          token.pos,
          token.pos
        )
      );
    }
  }
);

/**
 * Make sure single quotes are closed
 */
IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(
  TOKEN_NAMES.QUOTE_SINGLE,
  (token, parsed) => {
    if (!token.match[0].endsWith(`'`)) {
      token.parseProblems.push(IDL_PROBLEM_CODES.UNCLOSED_QUOTE);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.UNCLOSED_QUOTE,
          token.pos,
          token.pos
        )
      );
    }
  }
);
