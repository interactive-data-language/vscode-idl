import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithoutTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Extract TODO statements from comments
 */
IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(TOKEN_NAMES.COMMENT, (token, parsed) => {
  // make sure we have a TODO which means three capture groups
  // see comments.spec.ts for some examples
  if (token.match.length === 3) {
    token.parseProblems.push(IDL_PROBLEM_CODES.TODO);
    parsed.parseProblems.push(
      SyntaxProblemWithoutTranslation(
        IDL_PROBLEM_CODES.TODO,
        `TODO: ${token.match[2].trim()}`,
        token.pos,
        token.pos
      )
    );
  }
});
