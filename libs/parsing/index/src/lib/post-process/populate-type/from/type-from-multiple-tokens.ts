import { CancellationToken } from '@idl/cancellation-tokens';
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
} from '@idl/parsing/tokenizer';
import { IDL_ANY_TYPE, IDLDataType } from '@idl/types/core';
import copy from 'fast-copy';

import { GetVariable } from '../../../helpers/get-variable';
import { ITokenCache } from '../../../helpers/token-cache.interface';
import { IDLIndex } from '../../../idl-index.class';
import { TypeFromOperatorSplit } from './type-from-operator-split';
import { TypeFromTernary } from './type-from-ternary';
import { TypePromotion } from './type-promotion.ts';

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
