import { CancellationToken } from '@idl/cancellation-tokens';
import { IDL_ANY_TYPE, IDLDataType } from '@idl/data-types/core';
import {
  IParsed,
  SplitTreeOnOperators,
  SyntaxTree,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  AssignmentToken,
  LogicalTernaryThenToken,
  TOKEN_NAMES,
  TokenName,
} from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

import { GetVariable } from '../../../helpers/get-variable';
import { ITokenCache } from '../../../helpers/token-cache.interface';
import { IDLIndex } from '../../../idl-index.class';
import { TypeFromSingleToken } from './type-from-single-token';
import { TypeFromTernary } from './type-from-ternary';
import { TypePromotion } from './type-promotion.ts';

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
 * Attempts to determine the type from multiple children
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

/**
 * Attempts to determine the type from multiple children
 */
export function TypeFromMultipleTokens(
  index: IDLIndex,
  parsed: IParsed,
  children: SyntaxTree
): IDLDataType {
  // check for ternary operators
  for (let i = 0; i < children.length; i++) {
    switch (children[i].name) {
      case TOKEN_NAMES.LOGICAL_TERNARY_THEN:
        if ('type' in (children[i].cache as ITokenCache)) {
          return (children[i].cache as ITokenCache).type;
        }

        (children[i].cache as ITokenCache).type = TypeFromTernary(
          index,
          parsed,
          children[i] as TreeToken<LogicalTernaryThenToken>
        );
        return (children[i].cache as ITokenCache).type;

      /** Syntax like `a = (b + 5)` */
      case TOKEN_NAMES.ASSIGNMENT: {
        // get the token that comes before
        const before = i > 0 ? children[i - 1] : undefined;

        // get the type
        const type = TypeFromMultipleTokens(
          index,
          parsed,
          (children[i] as TreeToken<AssignmentToken>).kids
        );

        // check if we have a variable before
        if (before?.name === TOKEN_NAMES.VARIABLE) {
          // define variable
          const variable = GetVariable(before, parsed);

          // save deets if we have a variable
          if (
            variable !== undefined &&
            variable.name !== 'self' &&
            !variable.meta.isDefined
          ) {
            variable.pos = before.pos;
            variable.meta.type = type;
            variable.meta.isDefined = true;
          }
        }

        return copy(type);
      }
      default:
        break;
    }
  }

  /** Data types that we have found */
  let foundTypes: IDLDataType[] = [];

  // split on operators - make cancel token because this should be fast
  const split = SplitTreeOnOperators(children, new CancellationToken());

  // get the children and filter empty elements
  const splitTrees = split.children.filter((tree) => tree.length > 0);

  // process each split
  for (let i = 0; i < splitTrees.length; i++) {
    // skip if we have no kids, can get this if we start with
    // an operator
    if (splitTrees[i].length === 0) {
      continue;
    }
    foundTypes = foundTypes.concat(
      TypeFromOperatorSplit(index, parsed, splitTrees[i])
    );
  }

  // determine how to proceed
  switch (true) {
    case foundTypes.length === 1:
      return copy(foundTypes[0]);
    case foundTypes.length > 1:
      return copy(
        TypePromotion(
          index,
          parsed,
          foundTypes,
          splitTrees,
          split.startPos,
          split.endPos
        )
      );
    default:
      return copy(IDL_ANY_TYPE);
  }
}
