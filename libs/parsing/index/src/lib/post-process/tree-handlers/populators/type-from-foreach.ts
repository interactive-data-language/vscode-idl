import { BranchCallback } from '@idl/parsing/syntax-tree';
import { LoopForeachToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDLDataType, IDLTypeHelper, ParseIDLType } from '@idl/types/core';

import { TypeFromTokens } from '../../populate-type/from/type-from-tokens';
import { GetSplit } from '../helpers/get-split';
import { POPULATE_TYPE_HANDLER } from '../populate-type-handler';
import { PopulateTypeHandlerMeta } from '../populate-type-handler.interface';

/**
 * Union type of call routine tokens
 */
export type LoopTokens = LoopForeachToken;

/**
 * Tokens that we are validating
 */
const TOKENS: LoopTokens[] = [TOKEN_NAMES.LOOP_FOREACH];

/**
 * Get types from foreach
 */
const cb: BranchCallback<LoopTokens, PopulateTypeHandlerMeta> = (
  token,
  parsed,
  meta
) => {
  // split the tokens by our arguments
  const split = GetSplit(token);

  // return if nothing
  if (split.args.length === 0) {
    return;
  }

  // get the first split
  const first = split.args[0];

  // return if not only one child
  if (first.length !== 1) {
    return;
  }

  // get the first token
  const firstToken = first[0];

  // return if not a variable
  if (firstToken.name !== TOKEN_NAMES.VARIABLE) {
    return;
  }

  /** Get the variable name */
  const varName = firstToken.match[0].toLowerCase();

  // return if no matching variable
  if (!(varName in meta.variables)) {
    return;
  }

  /** Get variable source */
  const source = meta.variables[varName];

  // check for the second argument which will give us a type
  let type: IDLDataType;
  if (split.args.length > 1) {
    if (split.args[1].length > 0) {
      // get the type
      type = TypeFromTokens(meta.index, parsed, split.args[1]);

      // check if we have types with arguments (i.e. index type)
      const args = IDLTypeHelper.getAllTypeArgs(type);

      /**
       * Update type with arguments
       */
      if (args.length > 0) {
        type = args;
      }
    }
  }

  // define our first variable even if we dont have a type
  if (!source.meta.isDefined) {
    source.meta.isDefined = true;
    source.pos = firstToken.pos;
    if (type !== undefined) {
      source.meta.type = type;
    }
  }

  // check for a third variable
  if (split.args.length > 2) {
    if (split.args[2].length > 0) {
      const third = split.args[2][0];
      if (third.name === TOKEN_NAMES.VARIABLE) {
        /** Get variable source */
        const source3 = meta.variables[third.match[0].toLowerCase()];

        // define our first variable even if we dont have a type
        if (!source3.meta.isDefined) {
          source3.meta.isDefined = true;
          source3.pos = third.pos;
          source3.meta.type = ParseIDLType('number | String');
        }
      }
    }
  }
};

for (let i = 0; i < TOKENS.length; i++) {
  POPULATE_TYPE_HANDLER.onBranchToken(TOKENS[i], cb);
}
