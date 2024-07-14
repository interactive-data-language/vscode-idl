import {
  AddCodeToSyntaxTree,
  GenerateCodeToInsert,
} from '@idl/assembling/shared';
import { ASSEMBLER_PROBLEM_FIXERS } from '@idl/assembling/tree-handlers';
import {
  FindDirectBranchChildren,
  IParsed,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  CallProcedureToken,
  MainLevelToken,
  RoutineFunctionToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

import { HasProblem } from '../helpers/has-problem';

/**
 * Tokens we check for return type
 */
type RoutineTokens = RoutineProcedureToken;

/**
 * Tokens to check for missing return
 */
const TOKENS: RoutineTokens[] = [TOKEN_NAMES.ROUTINE_PROCEDURE];

/**
 * Callback to fix no return statement in functions
 */
function Callback(token: TreeToken<RoutineTokens>, parsed: IParsed) {
  // return if we don't have our problem
  if (
    HasProblem(
      token,
      IDL_PROBLEM_CODES.INIT_METHOD_NOT_FUNCTION,
      parsed.disabledProblems
    )
  ) {
    // change token type
    (token as any as TreeToken<RoutineFunctionToken>).name =
      TOKEN_NAMES.ROUTINE_FUNCTION;

    // change our match, do basic case-matching
    token.match[0] = token.match[0] === 'PRO' ? 'FUNCTION' : 'function';

    // check if we have a return procedure
    const returns = FindDirectBranchChildren(
      token,
      TOKEN_NAMES.CALL_PROCEDURE
    ).filter((item) => item.match[0].toLowerCase() === 'return');

    // add if we dont have a returns
    if (returns.length === 0) {
      if (token.end === undefined) {
        return;
      }

      // get the end position
      const endPos = token.end.pos;

      // update our syntax tree
      AddCodeToSyntaxTree({
        parsed,
        lineStart: endPos[0],
        insertCode: ['return, 1'],
        idxInsert: token.kids.length,
        addTo: token.kids,
      });
    } else {
      // set the children for all returns to use 1
      for (let i = 0; i < returns.length; i++) {
        // make the code every time because we need to properly set the line
        returns[i].kids = (
          (
            GenerateCodeToInsert(
              `return, 1`,
              returns[i].pos[0]
            )[0] as TreeToken<MainLevelToken>
          ).kids[0] as TreeToken<CallProcedureToken>
        ).kids;
      }
    }
  }
}

// add all token syntax validators
for (let i = 0; i < TOKENS.length; i++) {
  ASSEMBLER_PROBLEM_FIXERS.onBranchToken(TOKENS[i], (token, parsed) => {
    Callback(token, parsed);
  });
}
