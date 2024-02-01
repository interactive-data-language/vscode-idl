import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { VariableToken } from '@idl/parsing/tokenizer';
import { IDL_ANY_TYPE, IDLDataType } from '@idl/types/core';
import copy from 'fast-copy';

import { GetVariable } from '../../../helpers/get-variable';
import { IDLIndex } from '../../../idl-index.class';
import { EvaluateStaticReference } from './helpers/evaluate-static-reference';

/**
 * Attempts to determine the type from variables
 */
export function TypeFromVariable(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<VariableToken>
): IDLDataType {
  // get our variable source
  const source = GetVariable(token, parsed);

  // check if we found a match
  if (source !== undefined) {
    /**
     * If we dont have a variable that is defined, and we have a structure definition with the
     * same name, assume we are static reference to the class
     */
    if (!source.meta.isDefined) {
      EvaluateStaticReference(index, source, token);
    }

    // copy type and return
    return copy(source.meta.type);
  }

  // default return value
  return copy(IDL_ANY_TYPE);
}
