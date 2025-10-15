import { ASSEMBLER_PROBLEM_FIXERS } from '@idl/assembling/tree-handlers';
import { TOKEN_NAMES } from '@idl/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

import { HasProblem } from '../helpers/has-problem';

ASSEMBLER_PROBLEM_FIXERS.onBranchToken(
  TOKEN_NAMES.OPERATOR_LOGICAL,
  (token, parsed) => {
    if (
      HasProblem(token, IDL_PROBLEM_CODES.LOGICAL_OR, parsed.disabledProblems)
    ) {
      token.match[0] = token.match[0].replace(/or/i, '||');
    }
  }
);
