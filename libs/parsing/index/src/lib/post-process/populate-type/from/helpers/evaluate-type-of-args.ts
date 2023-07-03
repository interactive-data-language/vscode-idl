import { IDL_ANY_TYPE, IDLDataType } from '@idl/data-types/core';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import {
  CallFunctionMethodToken,
  CallFunctionToken,
} from '@idl/parsing/tokenizer';

import { IDLIndex } from '../../../../idl-index.class';
import { GetArgTypes } from '../../../tree-handlers/helpers/get-arg-types';

/**
 * Simple helper that tells us if a number is a number
 */
function IsNumber(name: string) {
  return (
    !isNaN(name as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(name))
  );
}

/**
 * Given a token determines our return type
 */
export function EvaluateTypeOfArgs(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallFunctionToken | CallFunctionMethodToken>,
  argType: IDLDataType
): IDLDataType {
  // get the types from our arguments
  const types = GetArgTypes(index, parsed, token);

  // track return types
  let returned: IDLDataType = [];

  // process each type
  for (let i = 0; i < argType.length; i++) {
    /**
     * If we dont have a type argument, return `any` type to make sure that
     * it is indeed returned
     */
    if (i > types.length - 1) {
      return IDL_ANY_TYPE;
    }

    /**
     * Get our i-th arg type
     */
    const args = argType[i].args;

    // get the argument
    const iArg = args[0][0].name;

    /**
     * If we dont have a number, return "any" because we cant process this
     */
    if (!IsNumber(iArg)) {
      return IDL_ANY_TYPE;
    }

    // get the arg index
    const aIdx = +iArg;
    if (aIdx > types.length - 1) {
      return IDL_ANY_TYPE;
    }

    // add type of argument
    returned = returned.concat(types[aIdx]);
  }

  return returned;
}
