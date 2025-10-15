import { PositionArray } from '@idl/types/tokenizer';

import { SyntaxTree } from '../../branches.interface';
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
