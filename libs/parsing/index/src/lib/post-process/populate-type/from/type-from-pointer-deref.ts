import {
  IParsed,
  SyntaxProblemWithTranslation,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { OperatorPointerToken } from '@idl/parsing/tokenizer';
import {
  IDL_ANY_TYPE,
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLTypeHelper,
} from '@idl/types/core';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';
import copy from 'fast-copy';

import { IDLIndex } from '../../../idl-index.class';
import { TypeFromTokens } from './type-from-tokens';

/**
 * Attempts to determine the type from pointer dereferencing
 */
export function TypeFromPointerDeref(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<OperatorPointerToken>
): IDLDataType {
  // if no children return
  if (token.kids.length === 0) {
    return copy(IDL_ANY_TYPE);
  }

  // get type from our children
  const type = TypeFromTokens(index, parsed, token.kids);

  // return if any
  if (IDLTypeHelper.isAnyType(type)) {
    return copy(IDL_ANY_TYPE);
  }

  /**
   * track output type
   */
  let outputType: IDLDataType = [];

  /** track the number of patching types */
  let found = 0;

  // process each type
  for (let i = 0; i < type.length; i++) {
    if (type[i].name === IDL_TYPE_LOOKUP.POINTER) {
      found++;
      outputType = outputType.concat(type[i].args[0]);
    }
  }

  // determine how to proceed
  if (found !== type.length) {
    // we didnt find a match so we throw an error
    parsed.postProcessProblems.push(
      SyntaxProblemWithTranslation(
        found === 0
          ? IDL_PROBLEM_CODES.POINTER_DE_REF_ILLEGAL_TYPE
          : IDL_PROBLEM_CODES.POINTER_DE_REF_AMBIGUITY,
        token.pos,
        token.end !== undefined ? token.end.pos : token.pos
      )
    );

    return copy(IDL_ANY_TYPE);
  } else {
    return copy(IDLTypeHelper.reduceIDLDataType(outputType));
  }
}
