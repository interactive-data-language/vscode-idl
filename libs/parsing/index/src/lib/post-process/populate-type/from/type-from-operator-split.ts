import {
  CHAIN_SKIP_TOKENS,
  CHAIN_TOKENS,
  IParsed,
  SyntaxTree,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/parsing/tokenizer';
import { IDL_ANY_TYPE, IDLDataType } from '@idl/types/core';
import copy from 'fast-copy';

import { IDLIndex } from '../../../idl-index.class';
import { TypeFromSingleToken } from './type-from-single-token';

/**
 * Attempts to determine the type from IDL statements separated by operators
 */
export function TypeFromOperatorSplit(
  index: IDLIndex,
  parsed: IParsed,
  children: SyntaxTree
): IDLDataType {
  /** Track the last entry in our access chain */
  let chain: TreeToken<TokenName> = undefined;

  // process each child
  for (let i = 0; i < children.length; i++) {
    // if we have an operator to skip, then skip
    if (children[i].name in CHAIN_SKIP_TOKENS) {
      continue;
    }

    // check if we have a token for a chain
    if (children[i].name in CHAIN_TOKENS) {
      chain = children[i];
    } else {
      /**
       * If we had a chain, but this token isn't part of that chain, then get the type for
       * the token at the end of the chain.
       */
      if (chain !== undefined) {
        return TypeFromSingleToken(index, parsed, chain);
      } else {
        /**
         * If we don't have a chain token, then save the type directly from the token
         *
         * TODO: Put logic in here that will error if any other type is found. This is because
         * we can't find anything else if we have found a single type
         */
        return TypeFromSingleToken(index, parsed, children[i]);
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
    return TypeFromSingleToken(index, parsed, chain);
  } else {
    return copy(IDL_ANY_TYPE);
  }
}
