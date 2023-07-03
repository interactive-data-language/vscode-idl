import { ASSEMBLER_PROBLEM_FIXERS } from '@idl/assembling/tree-handlers';
import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { CallProcedureToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';

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
    HasProblem(token, IDL_PROBLEM_CODES.RETURN_VALUES_FUNCTIONS) &&
    token.match[0].toLowerCase() === 'return'
  ) {
    if (token.end === undefined) {
      return;
    }

    // find child to delete
    let count = 0;
    let idx = 0;
    const kids = token.kids;
    for (let i = 0; i < kids.length; i++) {
      count += kids[i].name === TOKEN_NAMES.COMMA ? 1 : 0;
      if (count > 1) {
        idx = i;
        break;
      }
    }

    // remove excess args
    token.kids.splice(idx, token.kids.length - idx);
  }
}

// add all token syntax validators
for (let i = 0; i < TOKENS.length; i++) {
  ASSEMBLER_PROBLEM_FIXERS.onBranchToken(TOKENS[i], (token, parsed) => {
    Callback(token, parsed);
  });
}
