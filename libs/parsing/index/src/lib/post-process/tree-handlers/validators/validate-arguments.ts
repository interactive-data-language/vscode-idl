import { BranchCallback } from '@idl/parsing/syntax-tree';
import {
  CallFunctionMethodToken,
  CallFunctionToken,
  CallProcedureMethodToken,
  CallProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

import { GetArgTypes } from '../helpers/get-arg-types';
import { PopulateTypeHandlerMeta } from '../populate-type-handler.interface';
import { VALIDATE_TYPE_HANDLER } from '../validate-type-handler';

/**
 * Union type of call routine tokens
 */
export type CallRoutineToken =
  | CallProcedureToken
  | CallProcedureMethodToken
  | CallFunctionToken
  | CallFunctionMethodToken;

/**
 * Tokens that we are validating
 */
const TOKENS: CallRoutineToken[] = [
  TOKEN_NAMES.CALL_FUNCTION,
  TOKEN_NAMES.CALL_FUNCTION_METHOD,
  TOKEN_NAMES.CALL_PROCEDURE,
  TOKEN_NAMES.CALL_PROCEDURE_METHOD,
];

/**
 * Callback to validate that a keyword is correct
 */
const cb: BranchCallback<CallRoutineToken, PopulateTypeHandlerMeta> = (
  token,
  parsed,
  meta
) => {
  /**
   * Trigger getting type arguments, which uses our cache and doesn't
   * evaluate if we already did
   */
  GetArgTypes(meta.index, parsed, token);
};

for (let i = 0; i < TOKENS.length; i++) {
  VALIDATE_TYPE_HANDLER.onBranchToken(TOKENS[i], cb);
}
