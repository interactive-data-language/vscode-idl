import { IParsed, SyntaxTree, TreeToken } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/parsing/tokenizer';
import { IDLDataType } from '@idl/types/core';

import { IDLIndex } from '../../../idl-index.class';
import { TypeFromSingleToken } from './type-from-single-token';

/**
 * Tokens that we skip, some we shouldnt encounter, here just in case
 */
const SKIP_TYPES: { [key: string]: any } = {};
SKIP_TYPES[TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT] = true;
SKIP_TYPES[TOKEN_NAMES.COMMA] = true;
SKIP_TYPES[TOKEN_NAMES.LINE_CONTINUATION] = true;
SKIP_TYPES[TOKEN_NAMES.LINE_CONTINUATION_BASIC] = true;

/**
 * Types that indicate we are part of a chain
 */
export const CHAIN_TYPES: { [key: string]: any } = {};
CHAIN_TYPES[TOKEN_NAMES.PARENTHESES] = true;
CHAIN_TYPES[TOKEN_NAMES.VARIABLE] = true;
CHAIN_TYPES[TOKEN_NAMES.SYSTEM_VARIABLE] = true;
CHAIN_TYPES[TOKEN_NAMES.ACCESS_PROPERTY] = true;
CHAIN_TYPES[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = true;
CHAIN_TYPES[TOKEN_NAMES.BRACKET] = true;
CHAIN_TYPES[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
CHAIN_TYPES[TOKEN_NAMES.OPERATOR_POINTER] = true;

/**
 * Attempts to determine the type from IDL statements separated by operators
 */
export function TypeFromOperatorSplit(
  index: IDLIndex,
  parsed: IParsed,
  children: SyntaxTree
): IDLDataType[] {
  /** Data types that we have found */
  const foundTypes: IDLDataType[] = [];

  /** Track the last entry in our access chain */
  let chain: TreeToken<TokenName> = undefined;

  // process each child
  for (let i = 0; i < children.length; i++) {
    // if we have an operator to skip, then skip
    if (children[i].name in SKIP_TYPES) {
      continue;
    }

    // check if we have a token for a chain
    if (children[i].name in CHAIN_TYPES) {
      chain = children[i];
    } else {
      /**
       * If we had a chain, but this token isn't part of that chain, then get the type for
       * the token at the end of the chain.
       */
      if (chain !== undefined) {
        foundTypes.push(TypeFromSingleToken(index, parsed, chain));
        chain = undefined;
      } else {
        /**
         * If we don't have a chain token, then save the type directly from the token
         *
         * TODO: Put logic in here that will error if any other type is found. This is because
         * we can't find anything else if we have found a single type
         */
        foundTypes.push(TypeFromSingleToken(index, parsed, children[i]));
        return foundTypes;
      }
    }
  }

  /**
   * Check if we have a chain that didnt close, so we force it to close
   *
   * This would be if we only have a chain of operators that are in our
   * allowed chain operators (i.e 5 "access properties")
   */
  if (chain !== undefined) {
    foundTypes.push(TypeFromSingleToken(index, parsed, chain));
    chain = undefined;
  }

  return foundTypes;
}
