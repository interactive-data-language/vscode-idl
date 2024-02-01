import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import {
  CallFunctionMethodToken,
  CallProcedureMethodToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalFunctionMethodToken,
  GlobalProcedureMethodToken,
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLDataTypeBase,
  IDLTypeHelper,
  IDLTypes,
  IGlobalIndexedToken,
  ParseIDLType,
} from '@idl/types/core';

import { IDLIndex } from '../idl-index.class';
import { TypeFromTokens } from '../post-process/populate-type/from/type-from-tokens';
import { ITokenCache } from './token-cache.interface';

/**
 * Returns type information for the specified property
 *
 * Returns undefined if no method is found
 */
export function GetMethodForType<
  T extends GlobalFunctionMethodToken | GlobalProcedureMethodToken
>(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallProcedureMethodToken | CallFunctionMethodToken>,
  useCache: boolean,
  type: IDLDataTypeBase<IDLTypes>
): IGlobalIndexedToken<T>[] {
  // if no type, return
  if (type.name === IDL_TYPE_LOOKUP.ANY) {
    return [];
  }

  // get comparison type name
  const typeName = type.name.toLocaleLowerCase();

  // check for global token first
  const global = index.findMatchingGlobalToken(
    token.name === TOKEN_NAMES.CALL_FUNCTION_METHOD
      ? GLOBAL_TOKEN_TYPES.FUNCTION_METHOD
      : GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD,
    `${type.name}::${token.match[2]}`
  );

  // check if we found a match
  if (global.length > 0) {
    return global as IGlobalIndexedToken<T>[];
  } else {
    // check for global token first
    const globalStructure = index.findMatchingGlobalToken(
      GLOBAL_TOKEN_TYPES.STRUCTURE,
      typeName
    );

    // check if we have a structure to check for
    if (globalStructure.length > 0) {
      // see if we have inheritance
      const alsoCheck = globalStructure[0].meta.inherits;

      /** Init matches for global, do this in case we loop more than once */
      let matches: IGlobalIndexedToken<T>[];

      // make sure we have other properties
      for (let i = 0; i < alsoCheck.length; i++) {
        matches = GetMethod(
          index,
          parsed,
          token,
          useCache,
          ParseIDLType(alsoCheck[i])
        );
        if (matches.length > 0) {
          return matches;
        }
      }
    }
  }

  // default return
  return [];
}

/**
 * Returns type information for the specified property
 *
 * Returns an empty array if no method is found
 */
export function GetMethod<
  T extends GlobalFunctionMethodToken | GlobalProcedureMethodToken
>(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallProcedureMethodToken | CallFunctionMethodToken>,
  useCache = true,
  type?: IDLDataType
): IGlobalIndexedToken<T>[] {
  if ('method' in (token.cache as ITokenCache) && useCache) {
    return (token.cache as ITokenCache).method as IGlobalIndexedToken<T>[];
  }

  // set type if we didnt pass one in
  if (type === undefined) {
    if ((token.cache as ITokenCache).typeBefore === undefined) {
      type = TypeFromTokens(index, parsed, token.accessTokens);

      // save our type
      (token.cache as ITokenCache).typeBefore = type;
    } else {
      type = (token.cache as ITokenCache).typeBefore;
    }
  }

  // return early if any type
  if (IDLTypeHelper.isAnyType(type)) {
    (token.cache as ITokenCache).method = [];
    return [];
  }

  /** Found method for specific type */
  let found: IGlobalIndexedToken<T>[];

  // check each type
  for (let i = 0; i < type.length; i++) {
    found = GetMethodForType<T>(index, parsed, token, useCache, type[i]);
    if (found.length > 0) {
      (token.cache as ITokenCache).method = found;
      return found;
    }
  }

  (token.cache as ITokenCache).method = [];
  return [];
}
