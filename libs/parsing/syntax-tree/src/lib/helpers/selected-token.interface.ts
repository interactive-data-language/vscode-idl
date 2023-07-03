import { TokenName } from '@idl/parsing/tokenizer';

import { TreeBranchToken, TreeToken } from '../branches.interface';
import { ITreeRecurserCurrent } from '../recursion-and-callbacks/tree-recurser.interface';

/**
 * Parent for a selected token
 */
export type SelectedTokenParent = 'function' | 'procedure' | 'main';

/**
 * Information about our parent so that we can quickly look it up
 */
export interface IParentInformation {
  /** Type of the token we are tracking */
  type: SelectedTokenParent;
  /** Name of our parent token */
  name: string;
  /** Actual token */
  token: TreeBranchToken;
}

/**
 * Data structure for a selected token which includes what we have hovered over and
 * the parent we are contained within.
 */
export interface ISelectedToken extends ITreeRecurserCurrent {
  /** Token that we have selected */
  token?: TreeToken<TokenName>;
}
