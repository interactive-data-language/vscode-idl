import { ASSEMBLER_PROBLEM_FIXERS } from '@idl/assembling/tree-handlers';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { CallProcedureToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

import { HasProblem } from '../helpers/has-problem';

/**
 * Tokens we check for too many return args
 */
type RoutineTokens = CallProcedureToken;

/**
 * Tokens to check for too many return args
 */
const TOKENS: RoutineTokens[] = [TOKEN_NAMES.CALL_PROCEDURE];

/**
 * Callback to fix no return statement in functions
 */
function Callback(token: TreeToken<RoutineTokens>, parsed: IParsed) {
  // return if we don't have our problem
  if (
    HasProblem(
      token,
      IDL_PROBLEM_CODES.RETURN_VALUES_PROCEDURES,
      parsed.disabledProblems
    ) &&
    token.match[0].toLowerCase() === 'return'
  ) {
    if (token.end === undefined) {
      return;
    }

    // remove all children
    token.kids.splice(0, token.kids.length);

    // // update end
    // token.end.pos = token.pos;
  }
}

// add all token syntax validators
for (let i = 0; i < TOKENS.length; i++) {
  ASSEMBLER_PROBLEM_FIXERS.onBranchToken(TOKENS[i], (token, parsed) => {
    Callback(token, parsed);
  });
}
