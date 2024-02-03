import {
  GetRoutineNameFromScope,
  IParsed,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { NumberToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDLDataType } from '@idl/types/core';
import copy from 'fast-copy';

import { IDLIndex } from '../../../../idl-index.class';
import { TypeFromNumber } from './type-from-number';

/**
 * Attempts to determine the type from numbers
 */
export function TypeFromNumberOrNumberString(
  index: IDLIndex,
  token: TreeToken<NumberToken>,
  parsed: IParsed
): IDLDataType {
  /** Compile options */
  let compOpts: string[] = [];

  // check if we have scope tokens to look for
  if (token.scopeTokens.length > 0) {
    switch (token.scopeTokens[0].name) {
      case TOKEN_NAMES.ROUTINE_FUNCTION: {
        const routineName = GetRoutineNameFromScope(token);
        if (routineName in parsed.compile.func) {
          compOpts = parsed.compile.func[routineName];
        }
        break;
      }
      case TOKEN_NAMES.ROUTINE_PROCEDURE: {
        const routineName = GetRoutineNameFromScope(token);
        if (routineName in parsed.compile.pro) {
          compOpts = parsed.compile.pro[routineName];
        }
        break;
      }
      case TOKEN_NAMES.MAIN_LEVEL:
        compOpts = parsed.compile.main;
        break;
      default:
        break;
    }
  }

  // default return value
  return copy(TypeFromNumber(token, compOpts));
}
