import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

/**
 * Valid end for double quote
 */
const DOUBLE_QUOTE = /"/gim;

/**
 * Make sure double quotes are closed
 */
IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(
  TOKEN_NAMES.QUOTE_DOUBLE,
  (token, parsed) => {
    // split on quote, odd number means even quotes
    if (token.match[0].split(DOUBLE_QUOTE).length % 2 === 0) {
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
 * Valid end for single quote
 */
const SINGLE_QUOTE = /'/gim;

/**
 * Make sure single quotes are closed
 */
IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(
  TOKEN_NAMES.QUOTE_SINGLE,
  (token, parsed) => {
    // split on quote, odd number means even quotes
    if (token.match[0].split(SINGLE_QUOTE).length % 2 === 0) {
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
