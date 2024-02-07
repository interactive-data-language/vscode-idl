import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.OPERATOR_POINTER,
  (token, parsed) => {
    if (token.kids.length === 0) {
      token.parseProblems.push(IDL_PROBLEM_CODES.POINTER_NOTHING_TO_DE_REF);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.POINTER_NOTHING_TO_DE_REF,
          token.pos,
          token?.end?.pos || token.pos
        )
      );
    }
  }
);
