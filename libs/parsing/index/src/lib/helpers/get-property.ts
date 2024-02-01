import { GetPropertyName, IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import {
  AccessPropertyToken,
  StructurePropertyToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import {
  GLOBAL_TOKEN_TYPES,
  IDL_STRUCTURE_TYPE,
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLDataTypeBase,
  IDLTypes,
  IPropertyLookup,
  ParseIDLType,
} from '@idl/types/core';
import copy from 'fast-copy';

import { IDLIndex } from '../idl-index.class';
import { TypeFromTokens } from '../post-process/populate-type/from/type-from-tokens';
import { IFoundProperty } from './get-property.interface';
import { ITokenCache } from './token-cache.interface';

/**
 * Returns type information for the specified property
 *
 * Returns undefined if nothing is returned
 */
function GetPropertyForType(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<AccessPropertyToken | StructurePropertyToken>,
  prop: string,
  useCache: boolean,
  type: IDLDataTypeBase<IDLTypes>
): IFoundProperty | undefined {
  if (type.name === IDL_TYPE_LOOKUP.ANY) {
    return undefined;
  }

  /** Lower-case and trimmed string */
  const propName = prop.toLowerCase().trim();

  // init properties
  let properties: IPropertyLookup = {};

  /** File our token lives in */
  let file: string;

  /** Get our type name */
  let className = type.display;

  // check if we have an anonymous structure
  if (type.name === IDL_TYPE_LOOKUP.STRUCTURE) {
    properties = type.meta;
  } else {
    // check for global token first
    const global = index.findMatchingGlobalToken(
      GLOBAL_TOKEN_TYPES.STRUCTURE,
      type.name
    );

    // check if we found a match
    if (global.length > 0) {
      // extract properties from our global token
      properties = global[0].meta.props;

      // set file location
      file = global[0].file;

      // check if we dont have a match, so we need to see if we
      // have an inherited property
      if (!(propName in properties)) {
        // see if we have inheritance
        const alsoCheck = global[0].meta.inherits;

        let match: IFoundProperty;

        // check other structures
        for (let i = 0; i < alsoCheck.length; i++) {
          match = GetProperty(
            index,
            parsed,
            token,
            useCache,
            ParseIDLType(alsoCheck[i])
          );
          if (match !== undefined) {
            return match;
          }
        }
      } else {
        // update the display name for the class type
        className = global[0].meta.display;
      }
    }
  }

  // return property if we have a match
  if (propName in properties) {
    return Object.assign(copy(properties[propName]), {
      name: prop.toLowerCase(),
      file,
      class: ParseIDLType(className),
      globalType: GLOBAL_TOKEN_TYPES.STRUCTURE,
      globalName: className.toLowerCase(),
    });
  } else {
    return undefined;
  }
}

/**
 * Returns type information for the specified property
 *
 * Returns undefined if nothing is returned
 */
export function GetProperty(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<AccessPropertyToken | StructurePropertyToken>,
  useCache = true,
  type?: IDLDataType
): IFoundProperty | undefined {
  if ('property' in (token.cache as ITokenCache) && useCache) {
    return (token.cache as ITokenCache).property;
  }

  /**
   * Get the name of our property
   */
  const propName = GetPropertyName(token);

  /**
   * Check if we need to determine the typ
   */
  if (type === undefined) {
    // check if we are accessing a property via the dot notation
    if (token.name === TOKEN_NAMES.ACCESS_PROPERTY) {
      if ((token.cache as ITokenCache).typeBefore === undefined) {
        type = TypeFromTokens(index, parsed, token.accessTokens);
        (token.cache as ITokenCache).typeBefore = type;
      } else {
        type = (token.cache as ITokenCache).typeBefore;
      }
    } else {
      /**
       * We have a structure tag defined within aa structure, so
       * lets see if we have an anonymous structure or a named one
       */
      const local = token.scopeTokens[token.scopeTokens.length - 1];
      if (local.name === TOKEN_NAMES.STRUCTURE_NAME) {
        type = ParseIDLType(local.match[0]);
        (token.cache as ITokenCache).typeBefore = type;
      } else {
        /**
         * We dont have a named structure so we need to create the data that we return
         */
        (token.cache as ITokenCache).property = {
          name: propName.toLowerCase(),
          display: propName,
          direction: 'bidirectional',
          docs: '',
          code: true,
          pos: token.pos,
          source: 'user',
          class: IDL_STRUCTURE_TYPE,
          type: TypeFromTokens(index, parsed, token.kids),
          globalType: GLOBAL_TOKEN_TYPES.STRUCTURE,
          globalName: 'structure',
        };
        return (token.cache as ITokenCache).property;
      }
    }
  }

  // check each type
  for (let i = 0; i < type.length; i++) {
    const found = GetPropertyForType(
      index,
      parsed,
      token,
      propName,
      useCache,
      type[i]
    );
    if (found !== undefined) {
      (token.cache as ITokenCache).property = found;
      return found;
    }
  }

  (token.cache as ITokenCache).property = undefined;
  return undefined;
}
