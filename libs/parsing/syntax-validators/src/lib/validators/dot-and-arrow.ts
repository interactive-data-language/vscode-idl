import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

/**
 * Catch arrows
 */
IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(TOKEN_NAMES.ARROW, (token, parsed) => {
  token.parseProblems.push(IDL_PROBLEM_CODES.ILLEGAL_ARROW);
  parsed.parseProblems.push(
    SyntaxProblemWithTranslation(
      IDL_PROBLEM_CODES.ILLEGAL_ARROW,
      token.pos,
      token.pos
    )
  );
});

/**
 * Catch dots
 */
IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(TOKEN_NAMES.DOT, (token, parsed) => {
  token.parseProblems.push(IDL_PROBLEM_CODES.STANDALONE_DOT);
  parsed.parseProblems.push(
    SyntaxProblemWithTranslation(
      IDL_PROBLEM_CODES.STANDALONE_DOT,
      token.pos,
      token.pos
    )
  );
});
