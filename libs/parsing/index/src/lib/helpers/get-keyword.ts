import {
  IParameterLookup,
  IParameterOrPropertyDetails,
} from '@idl/data-types/core';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import {
  KeywordBinaryToken,
  KeywordDefinitionToken,
  KeywordToken,
} from '@idl/parsing/tokenizer';

import { IDLIndex } from '../idl-index.class';
import { GetKeywordDisplayName } from './get-keyword-display-name';
import { GetKeywords } from './get-keywords';
import { IFoundParameter } from './get-property.interface';
import { ITokenCache } from './token-cache.interface';

/**
 * Searches for keywords like IDL resolves them
 */
export function FindKeyword(
  name: string,
  keywords: IParameterLookup,
  strict = false
): IParameterOrPropertyDetails | undefined {
  if (name in keywords) {
    return keywords[name].code ? keywords[name] : undefined;
  }

  // do the fuzzy search
  const names = Object.keys(keywords);
  for (let i = 0; i < names.length; i++) {
    if (strict) {
      if (names[i] === name) {
        return keywords[names[i]].code ? keywords[names[i]] : undefined;
      }
    } else {
      if (names[i].startsWith(name)) {
        return keywords[names[i]].code ? keywords[names[i]] : undefined;
      }
    }
  }

  return undefined;
}

/**
 * Get keywords based on search criteria and returns the keywords for the
 * FIRST match that we find. If there are multiple routines, you will have
 * some weird behaviors.
 *
 * Only returns keywords for methods if we have a non-Any type so we don't make
 * any guesses
 */
export function GetKeyword(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<KeywordToken | KeywordBinaryToken | KeywordDefinitionToken>,
  useCache = true
): IFoundParameter | undefined {
  if ('keyword' in (token.cache as ITokenCache) && useCache) {
    return (token.cache as ITokenCache).keyword;
  }

  // get keywords for our source
  const found = GetKeywords(index, parsed, token, useCache);

  // return if nothing (i.e. methods without type detail)
  if (found === undefined) {
    (token.cache as ITokenCache).keyword = undefined;
    return undefined;
  }

  // get the keyword name to check for
  const displayName = GetKeywordDisplayName(token);
  const name = displayName.toLowerCase();

  /**
   * Find our keyword
   */
  const kw = FindKeyword(name, found.keywords);

  /**
   * Check if we found something
   */
  if (kw !== undefined) {
    (token.cache as ITokenCache).keyword = {
      ...kw,
      name,
      file: found.global.file,
      globalType: found.global.type,
      globalName: found.global.name,
    };
    return (token.cache as ITokenCache).keyword;
  }

  (token.cache as ITokenCache).keyword = undefined;
  return undefined;
}
