import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
  TreeBranchToken,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Validate ternary statements
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.LOGICAL_TERNARY_THEN,
  (token, parsed) => {
    // return if no children
    if (token.kids.length === 0) {
      return;
    }

    // get the last kid
    const last = token.kids[token.kids.length - 1];

    // check for syntax error
    if (last.name !== TOKEN_NAMES.LOGICAL_TERNARY_ELSE) {
      token.parseProblems.push(IDL_PROBLEM_CODES.INCOMPLETE_TERNARY);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.INCOMPLETE_TERNARY,
          token.pos,
          (last as TreeBranchToken).end !== undefined
            ? (last as TreeBranchToken).end.pos
            : last.pos
        )
      );
    }
  }
);
