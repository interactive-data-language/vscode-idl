import { ASSEMBLER_PROBLEM_FIXERS } from '@idl/assembling/tree-handlers';
import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import {
  CallFunctionMethodToken,
  CallFunctionToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

import { HasProblem } from '../helpers/has-problem';

/**
 * Tokens we check for too many return args
 */
type RoutineTokens = CallFunctionToken | CallFunctionMethodToken;

/**
 * Tokens to check for too many return args
 */
const TOKENS: RoutineTokens[] = [TOKEN_NAMES.CALL_FUNCTION];

/**
 * Callback to fix no return statement in functions
 */
function Callback(token: TreeToken<RoutineTokens>, parsed: IParsed) {
  // return if we don't have our problem
  if (HasProblem(token, IDL_PROBLEM_CODES.COLON_IN_FUNCTION)) {
    if (token.end === undefined) {
      return;
    }

    token.match = token.match.map((str) => str.replace('(', '[')) as any;
    token.end.match = token.end.match.map((str) =>
      str.replace(')', ']')
    ) as any;
  }
}

// add all token syntax validators

for (let i = 0; i < TOKENS.length; i++) {
  ASSEMBLER_PROBLEM_FIXERS.onBranchToken(TOKENS[i], (token, parsed) => {
    Callback(token, parsed);
  });
}
