import {
  CallFunctionMethodToken,
  CallFunctionToken,
  CallProcedureMethodToken,
  CallProcedureToken,
  TOKEN_NAMES,
} from '@idl/tokenizer';
import {
  GlobalIndexedRoutineToken,
  IParameterLookup,
} from '@idl/types/idl-data-types';
import { TreeToken } from '@idl/types/syntax-tree';

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
