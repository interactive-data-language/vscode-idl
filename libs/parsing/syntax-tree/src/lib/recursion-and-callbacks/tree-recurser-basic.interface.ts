import { CancellationToken } from '@idl/cancellation-tokens';
import { BasicTokenNames, NonBasicTokenNames } from '@idl/parsing/tokenizer';

import { TreeToken } from '../branches.interface';

/**
 * Callback for when we encounter basic tokens, return true
 * to stop iterating through the tree
 */
export type BasicTokenBasicCallback<T extends BasicTokenNames> = (
  token: TreeToken<T>,
  cancel: CancellationToken
) => boolean | void;

/**
 * Callback for when we encounter branch tokens, return true
 * to stop iterating through the tree
 */
export type BranchTokenBasicCallback<T extends NonBasicTokenNames> = (
  token: TreeToken<T>,
  cancel: CancellationToken
) => boolean | void;

/**
 * Options for our basic tree recursor
 */
export interface ITreeRecurserBasicOptions {
  /**
   * Function called when we encounter a basic token.
   *
   * The function should return a boolean value indicating if
   * recursion should stop (true) or not (false).
   */
  onBasicToken: BasicTokenBasicCallback<BasicTokenNames>;
  /**
   * function called when we encounter a branch token
   *
   * The function should return a boolean value indicating if
   * recursion should stop (true) or not (false).
   */
  onBranchToken: BranchTokenBasicCallback<NonBasicTokenNames>;
  /**
   * Specify the names of tokens that we will recurse into.
   *
   * If a token's name does not appear in this, then we will not recurse
   */
  recursionFilter?: { [key: string]: any };
}

/**
 * Data structure for a selected token which includes what we have hovered over and
 * the parent we are contained within.
 */
export interface ITreeRecurserBasicRecursionOptions
  extends ITreeRecurserBasicOptions {
  /** Flag if we need to exit */
  exit?: boolean | void;
  /**
   * Cancellation token
   */
  cancel: CancellationToken;
}

/**
 * Default options for the tree recurser
 */
export const BASE_TREE_RECURSER_BASIC_OPTIONS: ITreeRecurserBasicRecursionOptions =
  {
    onBasicToken: () => {
      return false;
    },
    onBranchToken: () => {
      return false;
    },
    cancel: new CancellationToken(),
  };
