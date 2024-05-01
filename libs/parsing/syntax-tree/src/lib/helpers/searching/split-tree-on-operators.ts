import { CancellationToken } from '@idl/cancellation-tokens';
import {
  OperatorIncrementDecrementToken,
  OperatorLogicalToken,
  OperatorNegativeToken,
  OperatorToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import { PositionArray } from '@idl/types/tokenizer';

import {
  SyntaxTree,
  TreeBranchToken,
  TreeToken,
} from '../../branches.interface';
import { TreeRecurserBasic } from '../../recursion-and-callbacks/tree-recurser-basic';
import { ISplitTreeOnOperators } from './split-tree-on-operators.interface';

/**
 * Operators that we split our syntax tree on
 */
const OPERATORS: { [key: string]: any } = {};
OPERATORS[TOKEN_NAMES.OPERATOR] = true;
// OPERATORS[TOKEN_NAMES.OPERATOR_COMPOUND] = true; // should not be present
// OPERATORS[TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT] = true; // basic token
OPERATORS[TOKEN_NAMES.OPERATOR_LOGICAL] = true;
OPERATORS[TOKEN_NAMES.OPERATOR_NEGATIVE] = true;

/**
 * Union type of all tokens that we split our tree on so that we
 * can be strictly typed
 */
export type SplitOperatorToken = TreeToken<
  | OperatorToken
  | OperatorIncrementDecrementToken
  | OperatorLogicalToken
  | OperatorNegativeToken
>;

/**
 * Takes an array of tokens (i.e. syntax tree) and recursively splits them
 * by operators
 */
export function SplitTreeOnOperators(
  tree: SyntaxTree,
  cancel: CancellationToken
): ISplitTreeOnOperators {
  /** Commas we split by */
  const operators: SplitOperatorToken[] = [];

  /** Children before/after each comma */
  const children: SyntaxTree[] = [];

  /** Track teh current children */
  let currentChildren: SyntaxTree = [];

  /** Start position for operators */
  let startPos: PositionArray;

  /** End position for operators */
  let endPos: PositionArray = [0, 0, 0];

  /**
   * Recurse through our tree
   */
  TreeRecurserBasic(tree, cancel, {
    recursionFilter: OPERATORS,
    onBranchToken: (token) => {
      // save starting position
      if (startPos === undefined) {
        startPos = token.pos;
      }

      /**
       * Determine how to proceed
       */
      switch (true) {
        /**
         * Is operator we need to split on?
         */
        case token.name in OPERATORS:
          operators.push(token as SplitOperatorToken);
          children.push(currentChildren.splice(0, currentChildren.length));

          // save end position
          if (token.end !== undefined) {
            endPos = token.end.pos;
          } else {
            endPos = token.pos;
          }
          break;

        /**
         * Is special operator that we need to split on
         */
        case token.name === TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT:
          currentChildren = currentChildren.concat(token.kids);
          break;

        // save to current children
        default:
          currentChildren.push(token);
          break;
      }
    },
    onBasicToken: (token) => {
      // save starting position
      if (startPos === undefined) {
        startPos = token.pos;
      }
      currentChildren.push(token);
    },
  });

  // save extra kids
  if (currentChildren.length > 0) {
    const last = currentChildren[currentChildren.length - 1];
    endPos = last.pos;
    if ((last as TreeBranchToken).end !== undefined) {
      endPos = (last as TreeBranchToken).end.pos;
    } else {
      endPos = last.pos;
    }

    children.push(currentChildren.splice(0, currentChildren.length));
  }

  return {
    operators,
    children,
    startPos,
    endPos,
  };
}
