import { TreeToken } from '@idl/parsing/syntax-tree';
import { SystemVariableToken } from '@idl/parsing/tokenizer';
import {
  GLOBAL_TOKEN_TYPES,
  IDL_ANY_TYPE,
  IDL_NULL_TYPE,
  IDLDataType,
  ParseIDLType,
} from '@idl/types/core';
import copy from 'fast-copy';

import { IDLIndex } from '../../../idl-index.class';

/**
 * Attempts to determine the type from a single variable
 */
export function TypeFromSystemVariable(
  index: IDLIndex,
  token: TreeToken<SystemVariableToken>
): IDLDataType {
  // get the name of our token
  const name = token.match[0].toLowerCase();

  // handle any special cases for system variables
  switch (name) {
    case '!null':
      return copy(IDL_NULL_TYPE);
    default: {
      // search for global structure definition
      const global = index.findMatchingGlobalToken(
        GLOBAL_TOKEN_TYPES.STRUCTURE,
        token.match[0]
      );

      if (global.length > 0) {
        return ParseIDLType(global[0].meta.display);
      }
      break;
    }
  }

  // default return value
  return copy(IDL_ANY_TYPE);
}
