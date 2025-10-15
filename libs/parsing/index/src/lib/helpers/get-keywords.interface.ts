import { TreeToken } from '@idl/parsing/syntax-tree';
import {
  CallFunctionMethodToken,
  CallFunctionToken,
  CallProcedureMethodToken,
  CallProcedureToken,
  TOKEN_NAMES,
} from '@idl/tokenizer';
import { GlobalIndexedRoutineToken, IParameterLookup } from '@idl/types/core';

/**
 * Tokens that represent calling a routine
 */
export const CALL_ROUTINE_TOKENS: { [key: string]: boolean } = {};
CALL_ROUTINE_TOKENS[TOKEN_NAMES.CALL_FUNCTION] = true;
CALL_ROUTINE_TOKENS[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
CALL_ROUTINE_TOKENS[TOKEN_NAMES.CALL_PROCEDURE] = true;
CALL_ROUTINE_TOKENS[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;

/**
 * Expected parent for keyword hover help
 */
export type CallRoutineToken = TreeToken<
  | CallFunctionMethodToken
  | CallFunctionToken
  | CallProcedureMethodToken
  | CallProcedureToken
>;

export interface IFoundKeywords {
  global: GlobalIndexedRoutineToken;
  keywords: IParameterLookup;
}
