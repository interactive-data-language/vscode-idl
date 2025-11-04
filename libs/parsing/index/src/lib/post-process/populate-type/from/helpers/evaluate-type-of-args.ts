import { CallFunctionMethodToken, CallFunctionToken } from '@idl/tokenizer';
import { IDL_ANY_TYPE, IDLDataType } from '@idl/types/idl-data-types';
import { IParsed, TreeToken } from '@idl/types/syntax-tree';

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
  token: TreeToken<CallFunctionMethodToken | CallFunctionToken>,
  argType: IDLDataType
): IDLDataType {
  /**
   * Return if no kids
   */
  if (token.kids.length === 0) {
    return IDL_ANY_TYPE;
  }

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

    /**
     * Get the argument index
     *
     * Use the serialized property because this should be our number
     * as a string.
     *
     * The "name" property doesn't work here any more because the type
     * will not be "Number" and will instead be something like "Int"
     * because of our smart IDL type processing.
     */
    const iArg = args[0][0].serialized;

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
