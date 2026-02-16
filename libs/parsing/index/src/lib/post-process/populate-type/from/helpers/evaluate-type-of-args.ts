import { IDLTypeEvaluator } from '@idl/parsing/type-parser';
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

  // evaluate the type
  return IDLTypeEvaluator.typeOfArgs(argType, types);
}
