import {
  FindDirectBranchChildren,
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';
/**
 * Check return statements in procedures
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION,
  (token, parsed) => {
    // get all procedures we are calling
    const commas = FindDirectBranchChildren(token, TOKEN_NAMES.COMMA);

    // check if too many arguments
    if (commas.length > 1) {
      token.parseProblems.push(IDL_PROBLEM_CODES.STRING_LITERAL_TOO_MANY_ARGS);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.STRING_LITERAL_TOO_MANY_ARGS,
          token.pos,
          token.end ? token.end.pos : token.pos
        )
      );
    }
  }
);
