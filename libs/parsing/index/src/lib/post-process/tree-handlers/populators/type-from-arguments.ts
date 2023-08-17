import { IDL_ANY_TYPE } from '@idl/data-types/core';
import { BranchCallback } from '@idl/parsing/syntax-tree';
import {
  CallFunctionMethodToken,
  CallFunctionToken,
  CallProcedureMethodToken,
  CallProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

import { GetRoutine } from '../../../helpers/get-routine';
import { GetSplit } from '../helpers/get-split';
import { POPULATE_TYPE_HANDLER } from '../populate-type-handler';
import { PopulateTypeHandlerMeta } from '../populate-type-handler.interface';

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
 * Get type from arguments
 */
const cb: BranchCallback<CallRoutineToken, PopulateTypeHandlerMeta> = (
  token,
  parsed,
  meta
) => {
  // get our routine source
  const globals = GetRoutine(meta.index, parsed, token);

  /**
   * Get array of arguments, is empty if we dont know what we are processing
   */
  const args =
    globals.length > 0
      ? Object.values(globals[0].meta.args).filter((arg) => arg.code === true)
      : [];

  // split the tokens by our arguments
  const split = GetSplit(token);

  // process each potential argument
  for (let i = 0; i < split.args.length; i++) {
    // skip input arguments
    if (args[i]?.direction === 'in') {
      continue;
    }

    // get the children
    const kids = split.args[i];

    // sip if not one kid
    if (kids.length !== 1) {
      continue;
    }

    // skip if not variable
    if (kids[0].name !== TOKEN_NAMES.VARIABLE) {
      continue;
    }

    /** Variable name */
    const name = kids[0].match[0].toLowerCase();

    // skip self
    if (name === 'self') {
      continue;
    }

    // get variable source
    const source = meta.variables[name];

    // skip if we dont have anything
    if (source === undefined) {
      continue;
    }

    // skip if defined
    if (source.meta.isDefined) {
      continue;
    }

    // save type
    source.meta.type = args[i]?.type || IDL_ANY_TYPE;

    // update position
    source.pos = kids[0].pos;

    // save as processed
    source.meta.isDefined = true;
  }
};

for (let i = 0; i < TOKENS.length; i++) {
  POPULATE_TYPE_HANDLER.onBranchToken(TOKENS[i], cb);
}
