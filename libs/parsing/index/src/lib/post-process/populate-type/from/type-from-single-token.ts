import { BRANCH_TYPES, IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/parsing/tokenizer';
import { IDL_ANY_TYPE, IDL_STRING_TYPE, IDLDataType } from '@idl/types/core';
import copy from 'fast-copy';

import { ITokenCache } from '../../../helpers/token-cache.interface';
import { IDLIndex } from '../../../idl-index.class';
import { EvaluateToken } from '../evaluate/evaluate-token';
import { TypeFromFunction } from './function/type-from-function';
import { TypeFromNumberOrNumberString } from './numbers/type-from-number-or-number-string';
import { TypeFromBracket } from './type-from-bracket';
import { TypeFromCallFunctionMethod } from './type-from-call-function-method';
import { TypeFromMultipleTokens } from './type-from-multiple-tokens';
import { TypeFromPointerDeref } from './type-from-pointer-deref';
import { TypeFromProperty } from './type-from-property';
import { TypeFromStructure } from './type-from-structures';
import { TypeFromSystemVariable } from './type-from-system-variable';
import { TypeFromVariable } from './type-from-variable';

/**
 * Map of types that we can easily determine
 */
const TYPE_MAP: { [key: string]: IDLDataType } = {};
TYPE_MAP[TOKEN_NAMES.QUOTE_SINGLE] = IDL_STRING_TYPE;
TYPE_MAP[TOKEN_NAMES.QUOTE_DOUBLE] = IDL_STRING_TYPE;
TYPE_MAP[TOKEN_NAMES.STRING_TEMPLATE_LITERAL] = IDL_STRING_TYPE;
TYPE_MAP[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = IDL_ANY_TYPE;

/**
 * Attempts to determine the type of a single child with assignment
 */
export function TypeFromSingleToken(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<TokenName>
): IDLDataType {
  if ('type' in (token.cache as ITokenCache)) {
    return (token.cache as ITokenCache).type;
  }

  // determine what kind of token we have
  switch (token.name) {
    case TOKEN_NAMES.CALL_FUNCTION:
      (token.cache as ITokenCache).type = TypeFromFunction(
        index,
        parsed,
        token
      );
      break;
    case TOKEN_NAMES.VARIABLE:
      (token.cache as ITokenCache).type = TypeFromVariable(
        index,
        parsed,
        token
      );
      break;
    case TOKEN_NAMES.SYSTEM_VARIABLE:
      (token.cache as ITokenCache).type = TypeFromSystemVariable(index, token);
      break;
    case TOKEN_NAMES.STRUCTURE:
      (token.cache as ITokenCache).type = TypeFromStructure(
        index,
        token,
        parsed
      );
      break;
    case TOKEN_NAMES.NUMBER:
      (token.cache as ITokenCache).type = TypeFromNumberOrNumberString(
        index,
        token,
        parsed
      );
      break;
    case TOKEN_NAMES.ACCESS_PROPERTY:
      (token.cache as ITokenCache).type = TypeFromProperty(
        index,
        parsed,
        token
      );
      break;
    case TOKEN_NAMES.CALL_FUNCTION_METHOD:
      (token.cache as ITokenCache).type = TypeFromCallFunctionMethod(
        index,
        parsed,
        token
      );
      break;
    case TOKEN_NAMES.PARENTHESES:
      (token.cache as ITokenCache).type = TypeFromMultipleTokens(
        index,
        parsed,
        token.kids
      );
      break;
    case TOKEN_NAMES.BRACKET:
      (token.cache as ITokenCache).type = TypeFromBracket(index, parsed, token);
      break;
    case TOKEN_NAMES.OPERATOR_POINTER:
      (token.cache as ITokenCache).type = TypeFromPointerDeref(
        index,
        parsed,
        token
      );
      break;
    default:
      // do we have a general case for some types?
      if (token.name in TYPE_MAP) {
        (token.cache as ITokenCache).type = copy(TYPE_MAP[token.name]);
        (token.cache as ITokenCache).type[0].value = EvaluateToken(token);
      }
      break;
  }

  // if we set our cache, return
  if ('type' in (token.cache as ITokenCache)) {
    if ((token.cache as ITokenCache)?.type?.length > 0) {
      (token.cache as ITokenCache).type[0].value = EvaluateToken(token);
    }
    return (token.cache as ITokenCache).type;
  }

  // if we have a branch token, by default lets recurse and try to find type from kids
  if (token.type === BRANCH_TYPES.BRANCH) {
    (token.cache as ITokenCache).type = TypeFromMultipleTokens(
      index,
      parsed,
      token.kids
    );
    return (token.cache as ITokenCache).type;
  }

  // default return
  (token.cache as ITokenCache).type = copy(IDL_ANY_TYPE);
  return (token.cache as ITokenCache).type;
}
