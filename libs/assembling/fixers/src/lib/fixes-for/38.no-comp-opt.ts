import { AddCodeToSyntaxTree } from '@idl/assembling/shared';
import { ASSEMBLER_PROBLEM_FIXERS } from '@idl/assembling/tree-handlers';
import { IParsed, TreeBranchToken, TreeToken } from '@idl/parsing/syntax-tree';
import {
  MainLevelToken,
  RoutineFunctionToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

import { HasProblem } from '../helpers/has-problem';

/**
 * Tokens that, if they have children, expect a comma to be the first thing
 */
type RoutineTokens =
  | RoutineProcedureToken
  | RoutineFunctionToken
  | MainLevelToken;

/**
 * Tokens to check for unexpected commas
 */
const TOKENS: RoutineTokens[] = [
  TOKEN_NAMES.ROUTINE_PROCEDURE,
  TOKEN_NAMES.ROUTINE_FUNCTION,
  TOKEN_NAMES.MAIN_LEVEL,
];

const MAIN_LEVEL_SKIPS: { [key: string]: boolean } = {};
MAIN_LEVEL_SKIPS[TOKEN_NAMES.COMMENT] = true;
MAIN_LEVEL_SKIPS[TOKEN_NAMES.COMMENT_BLOCK] = true;

const ROUTINE_SKIPS: { [key: string]: boolean } = {};
ROUTINE_SKIPS[TOKEN_NAMES.ROUTINE_NAME] = true;
ROUTINE_SKIPS[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;

/**
 * Call back to make sure that, if we have children, there is a comma first
 */
function Callback(token: TreeToken<RoutineTokens>, parsed: IParsed) {
  // return if we don't have our problem
  if (
    HasProblem(token, IDL_PROBLEM_CODES.NO_COMPILE_OPT, parsed.disabledProblems)
  ) {
    // do something
    const kids = token.kids;

    // determine where we insert our code
    let idx = 0;
    let lineStart = token.pos[0];

    // get token filters for what to skip
    const filters =
      token.name === TOKEN_NAMES.MAIN_LEVEL ? MAIN_LEVEL_SKIPS : ROUTINE_SKIPS;

    // process each child until we find a space
    for (let i = 0; i < kids.length; i++) {
      if (!(kids[i].name in filters)) {
        break;
      }
      lineStart =
        (kids[i] as TreeBranchToken).end !== undefined
          ? (kids[i] as TreeBranchToken).end.pos[0] + 1
          : kids[i].pos[0] + 1;
      idx = i;
    }

    // update our syntax tree
    AddCodeToSyntaxTree({
      parsed,
      lineStart,
      insertCode: ['compile_opt idl2'],
      idxInsert: idx + 1,
      addTo: kids,
    });
  }
}

// add all token syntax validators
for (let i = 0; i < TOKENS.length; i++) {
  ASSEMBLER_PROBLEM_FIXERS.onBranchToken(TOKENS[i], (token, parsed) => {
    Callback(token, parsed);
  });
}
