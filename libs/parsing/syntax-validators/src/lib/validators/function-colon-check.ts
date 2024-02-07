import {
  IDL_SYNTAX_TREE_VALIDATOR,
  IsChildInBranch,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

/**
 * Check for colons in function calls
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.CALL_FUNCTION,
  (branch, parsed) => {
    if (IsChildInBranch(branch, TOKEN_NAMES.COLON)) {
      branch.parseProblems.push(IDL_PROBLEM_CODES.COLON_IN_FUNCTION);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.COLON_IN_FUNCTION,
          branch.pos,
          branch.end ? branch.end.pos : branch.pos
        )
      );
    }
  }
);

/**
 * Check for colons in function method calls
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.CALL_FUNCTION_METHOD,
  (branch, parsed) => {
    if (IsChildInBranch(branch, TOKEN_NAMES.COLON)) {
      branch.parseProblems.push(IDL_PROBLEM_CODES.COLON_IN_FUNCTION_METHOD);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.COLON_IN_FUNCTION_METHOD,
          branch.pos,
          branch.end ? branch.end.pos : branch.pos
        )
      );
    }
  }
);
