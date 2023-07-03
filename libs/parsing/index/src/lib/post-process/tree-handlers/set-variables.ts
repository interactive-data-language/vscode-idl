import {
  ILocalTokenLookup,
  IParsed,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  MainLevelToken,
  RoutineFunctionToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
  TokenName,
} from '@idl/parsing/tokenizer';

import { GetVariables } from '../../helpers/get-variables';

/**
 * Union type of call routine tokens
 */
export type CallRoutineToken =
  | RoutineFunctionToken
  | RoutineProcedureToken
  | MainLevelToken;

/**
 * Tokens that we are validating
 */
export const SET_VARIABLE_TOKENS: { [key: string]: any } = {};
SET_VARIABLE_TOKENS[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
SET_VARIABLE_TOKENS[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;
SET_VARIABLE_TOKENS[TOKEN_NAMES.MAIN_LEVEL] = true;

/**
 * Callback to set variables based on the top-level routine we are
 * within
 */
export function SetVariables(
  token: TreeToken<TokenName>,
  parsed: IParsed,
  variables: ILocalTokenLookup
) {
  // empty
  const current = Object.keys(variables);
  for (let i = 0; i < current.length; i++) {
    delete variables[current[i]];
  }

  // fill
  const newVars = GetVariables(token, parsed);
  const add = Object.keys(newVars);
  for (let i = 0; i < add.length; i++) {
    variables[add[i]] = newVars[add[i]];
  }
}
