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
} from '@idl/tokenizer';

import { GetVariables } from '../../helpers/get-variables';

/**
 * Union type of call routine tokens
 */
export type CallRoutineToken =
  | MainLevelToken
  | RoutineFunctionToken
  | RoutineProcedureToken;

/**
 * Tokens that we are validating
 */
export const SET_VARIABLE_TOKENS: { [key: string]: any } = {};
SET_VARIABLE_TOKENS[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
SET_VARIABLE_TOKENS[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;
SET_VARIABLE_TOKENS[TOKEN_NAMES.MAIN_LEVEL] = true;

/**
 * Sets the variables for the global token we are within
 *
 * This makes sure our tree iterators have the right variables for
 * procedures, functions, main level programs, etc.
 */
export function SetVariablesForIterators(
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
  Object.assign(variables, GetVariables(token, parsed));
}
