import { IDLTypeHelper } from '@idl/parsing/type-parser';
import { SystemVariableToken } from '@idl/tokenizer';
import {
  GLOBAL_TOKEN_TYPES,
  IDL_ANY_TYPE,
  IDL_NULL_TYPE,
  IDLDataType,
} from '@idl/types/idl-data-types';
import { TreeToken } from '@idl/types/syntax-tree';
import { copy } from 'fast-copy';

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
        return IDLTypeHelper.parseIDLType(global[0].meta.display);
      }
      break;
    }
  }

  // default return value
  return copy(IDL_ANY_TYPE);
}
