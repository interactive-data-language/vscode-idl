import { PositionArray } from '@idl/types/tokenizer';

import { SyntaxTree } from '../../branches.interface';
import { SplitOperatorToken } from './split-tree-on-operators';

/**
 * Data structure for a split tree
 */
export interface ISplitTreeOnOperators {
  operators: SplitOperatorToken[];
  children: SyntaxTree[];
  startPos: PositionArray;
  endPos: PositionArray;
}
