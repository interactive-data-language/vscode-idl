import { SyntaxTree } from '@idl/types/syntax-tree';
import { PositionArray } from '@idl/types/tokenizer';

import { SplitOperatorToken } from './split-tree-on-operators';

/**
 * Data structure for a split tree
 */
export interface ISplitTreeOnOperators {
  /** The tokens being operated on */
  children: SyntaxTree[];
  /** End position of the operators */
  endPos: PositionArray;
  /** The operators we split on */
  operators: SplitOperatorToken[];
  /** Start position of operators */
  startPos: PositionArray;
}
