import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import {
  GetRoutineName,
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
  TreeBranchToken,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { NAME_TOKENS } from './return-functions';

/**
 * Check for empty main level programs
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.ROUTINE_PROCEDURE,
  (token, parsed) => {
    if (GetRoutineName(token).endsWith('::init')) {
      // get end position at end of routine name
      let endPos = token.pos;
      const first = token.kids[0];
      if (first?.name in NAME_TOKENS) {
        if ((first as TreeBranchToken).end !== undefined) {
          endPos = (first as TreeBranchToken).end.pos;
        }
      }

      token.parseProblems.push(IDL_PROBLEM_CODES.INIT_METHOD_NOT_FUNCTION);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.INIT_METHOD_NOT_FUNCTION,
          token.pos,
          endPos
        )
      );
    }
  }
);
