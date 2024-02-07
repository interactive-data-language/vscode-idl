import { AddCodeToSyntaxTree } from '@idl/assembling/shared';
import { ASSEMBLER_PROBLEM_FIXERS } from '@idl/assembling/tree-handlers';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { RoutineFunctionToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

import { HasProblem } from '../helpers/has-problem';

/**
 * Tokens we check for return type
 */
type RoutineTokens = RoutineFunctionToken;

/**
 * Tokens to check for missing return
 */
const TOKENS: RoutineTokens[] = [TOKEN_NAMES.ROUTINE_FUNCTION];

/**
 * Callback to fix no return statement in functions
 */
function Callback(token: TreeToken<RoutineTokens>, parsed: IParsed) {
  // return if we don't have our problem
  if (
    HasProblem(token, IDL_PROBLEM_CODES.RETURN_MISSING, parsed.disabledProblems)
  ) {
    if (token.end === undefined) {
      return;
    }

    // get the end position
    const endPos = token.end.pos;

    // update our syntax tree
    AddCodeToSyntaxTree({
      parsed,
      lineStart: endPos[0],
      insertCode: ['return, !null'],
      idxInsert: token.kids.length,
      addTo: token.kids,
    });
  }
}

// add all token syntax validators
for (let i = 0; i < TOKENS.length; i++) {
  ASSEMBLER_PROBLEM_FIXERS.onBranchToken(TOKENS[i], (token, parsed) => {
    Callback(token, parsed);
  });
}
