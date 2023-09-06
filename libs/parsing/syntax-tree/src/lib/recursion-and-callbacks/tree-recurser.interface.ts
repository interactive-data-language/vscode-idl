import { CancellationToken } from '@idl/cancellation-tokens';
import {
  BasicTokenNames,
  NonBasicTokenNames,
  TOKEN_NAMES,
  TokenName,
} from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

import { TreeToken } from '../branches.interface';
import {
  IParentInformation,
  SelectedTokenParent,
} from '../helpers/selected-token.interface';

/**
 * Callback for when we encounter basic tokens
 */
export type BasicTokenCallback<T extends BasicTokenNames> = (
  token: TreeToken<T>,
  current: ITreeRecurserCurrent
) => boolean | void;

/**
 * Callback for when we encounter branch tokens
 */
export type BranchTokenCallback<T extends NonBasicTokenNames> = (
  token: TreeToken<T>,
  current: ITreeRecurserCurrent
) => boolean | void;

/**
 * options for our tree recurser
 */
export interface ITreeRecurserOptions {
  /**
   * Function called when we encounter a basic token.
   *
   * The function should return a boolean value indicating if
   * recursion should stop (true) or not (false or void).
   */
  onBasicToken: BasicTokenCallback<BasicTokenNames>;
  /**
   * Function called when we encounter a branch token
   *
   * > See additional properties below for details on order of execution (parent/branch first)
   *
   * The function should return a boolean value indicating if
   * recursion should stop (true) or not (false or void).
   */
  onBranchToken: BranchTokenCallback<NonBasicTokenNames>;
  /**
   * A lookup with the token names for allowed global parents which should
   * all be BranchTokens
   */
  allowedGlobalParents: { [key: string]: SelectedTokenParent };
  /**
   * A lookup with the names of all tokens allowed to be used for access (i.e variables, properties, parentheses)
   */
  allowedAccessTokens: { [key: string]: boolean };
  /**
   * Do we process a branch before our children?
   */
  processBranchFirst: boolean;
  /**
   * Tokens in here indicate that we process the branch last last.
   *
   * This takes precedence over process branch first
   */
  processBranchLastFor: { [key: string]: any };
  /**
   * Tokens in here indicate that we process the branch first
   *
   * This takes precedence over process branch last for
   */
  processBranchFirstFor: { [key: string]: any };
  /**
   * Specify the names of tokens that we want to skip and not process
   */
  skipTokens: { [key: string]: any };
}

/**
 * Data structure for where we currently are within the tree
 */
export interface ITreeRecurserCurrent {
  /**
   * Current global parent token from our specified global parents
   *
   * Additional metadata is included such as the routine name and the
   * type of routine
   */
  globalParent?: IParentInformation;
  /** Direct parent that we belong to */
  localParent?: TreeToken<NonBasicTokenNames>;
  /** Token that is immediately before */
  before?: TreeToken<TokenName>;
  /**
   * Names of parents for where we currently are
   */
  scope: NonBasicTokenNames[];
  /**
   * Actual tokens for our scope
   */
  scopeTokens: TreeToken<NonBasicTokenNames>[];
  /**
   * Any tokens used for access directly before our current token
   */
  accessTokens: TreeToken<TokenName>[];
  /**
   * Token to cancel work
   */
  cancel: CancellationToken;
}

/**
 * Default value of our current location, for use when manually
 * using the tree callback
 */
export const DEFAULT_CURRENT: ITreeRecurserCurrent = {
  scope: [],
  scopeTokens: [],
  accessTokens: [],
  cancel: new CancellationToken(),
};

/**
 * Data structure for a selected token which includes what we have hovered over and
 * the parent we are contained within.
 */
export interface ITreeRecurserRecursionOptions
  extends ITreeRecurserOptions,
    ITreeRecurserCurrent {
  /** Flag if we need to exit */
  exit?: boolean | void;
}

/**
 * Default parents to save as we go
 */
export const DEFAULT_GLOBAL_PARENTS: {
  [key: string]: SelectedTokenParent;
} = {};
DEFAULT_GLOBAL_PARENTS[TOKEN_NAMES.ROUTINE_FUNCTION] = 'function';
DEFAULT_GLOBAL_PARENTS[TOKEN_NAMES.ROUTINE_PROCEDURE] = 'procedure';
DEFAULT_GLOBAL_PARENTS[TOKEN_NAMES.MAIN_LEVEL] = 'main';

/**
 * Track the tokens that we can operate on with property access or
 * method invocation
 */
export const DEFAULT_ACCESS_TOKENS: { [key: string]: boolean } = {};
DEFAULT_ACCESS_TOKENS[TOKEN_NAMES.VARIABLE] = true;
DEFAULT_ACCESS_TOKENS[TOKEN_NAMES.SYSTEM_VARIABLE] = true;
DEFAULT_ACCESS_TOKENS[TOKEN_NAMES.ACCESS_PROPERTY] = true;
DEFAULT_ACCESS_TOKENS[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = true;
DEFAULT_ACCESS_TOKENS[TOKEN_NAMES.PARENTHESES] = true;
DEFAULT_ACCESS_TOKENS[TOKEN_NAMES.BRACKET] = true;

/**
 * Default options for the tree recurser
 */
export const BASE_TREE_RECURSER_OPTIONS: ITreeRecurserOptions = {
  processBranchFirst: false,
  processBranchLastFor: {},
  processBranchFirstFor: {},
  skipTokens: {},
  allowedGlobalParents: copy(DEFAULT_GLOBAL_PARENTS),
  allowedAccessTokens: copy(DEFAULT_ACCESS_TOKENS),
  onBasicToken: () => {
    return false;
  },
  onBranchToken: () => {
    return false;
  },
};
