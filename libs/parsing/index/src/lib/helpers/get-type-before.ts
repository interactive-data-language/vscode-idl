import { IDL_ANY_TYPE, IDLDataType } from '@idl/data-types/core';
import {
  DEFAULT_ACCESS_TOKENS,
  IParsed,
  ISelectedToken,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

import { IDLIndex } from '../idl-index.class';
import { TypeFromTokens } from '../post-process/populate-type/from/type-from-tokens';

/**
 * If we have these tokens, we try to get the type for them
 *
 * Otherwise we return
 */
const GET_TYPES_FOR_THESE: { [key: string]: boolean } = {};
GET_TYPES_FOR_THESE[TOKEN_NAMES.DOT] = true;
GET_TYPES_FOR_THESE[TOKEN_NAMES.ARROW] = true;
GET_TYPES_FOR_THESE[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = true;
GET_TYPES_FOR_THESE[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
GET_TYPES_FOR_THESE[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;

/**
 * Method tokens, by name
 */
export const METHODS: { [key: string]: boolean } = {};
METHODS[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
METHODS[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;

/**
 * Returns information about the data type that we are auto-completing given
 * recursive properties that we may also have
 */
export function GetTypeBefore(
  index: IDLIndex,
  cursor: ISelectedToken,
  parsed: IParsed
): IDLDataType {
  // specify the access tokens to use
  let access: TreeToken<TokenName>[] = [];

  // use some smarts to determine the type that we need to return
  if (cursor.token !== undefined) {
    /**
     * if we are an access token, use our own access path
     * or use our own access path if we are a method which is the end
     * of an access oath
     */
    if (
      cursor.token.name in DEFAULT_ACCESS_TOKENS ||
      cursor.token.name in GET_TYPES_FOR_THESE
    ) {
      access = cursor.token.accessTokens || [];
    } else {
      const tmp = cursor.token.scope;

      /**
       * Go up our scope tree to see if we have a method call that we should use
       * for types, starting with the end
       */
      for (let i = tmp.length - 1; i > -1; i--) {
        if (tmp[i] in METHODS) {
          access = cursor.token.scopeTokens[i]?.accessTokens || [];
          break;
        }
      }
    }
  }

  // sanity check there is content
  if (access.length > 0) {
    return TypeFromTokens(index, parsed, access);
  }

  // default value to return
  return copy(IDL_ANY_TYPE);
}
