import { IDLProblemCode } from '@idl/parsing/problem-codes';
import {
  BasicTokenNames,
  NonBasicTokenNames,
  TokenizerToken,
  TokenName,
  TokenStartMatches,
} from '@idl/parsing/tokenizer';
import { PositionArray } from '@idl/parsing/tokenizer-types';

/** Branch in our syntax tree that has a start, end, and potentially children */
export type SyntaxTreeBranch = 0;

/** Basic (i.e. baby) branch in syntax tree where we don't have children */
export type SyntaxTreeBasic = 1;

/** Unknown branch that we parsed */
export type SyntaxTreeUnknown = 2;

/** All allowed types of branches */
export type SyntaxTreeBranches =
  | SyntaxTreeBranch
  | SyntaxTreeBasic
  | SyntaxTreeUnknown;

/** Data structure for overriding hovers */
export interface IHoverOverride {
  /** Cursor location for hover override */
  pos: PositionArray;
  /** Docs to show on hover */
  docs: string;
}

/** Base data structure for a branch */
interface IBranchBase<T extends TokenName> {
  /** Type of the branch */
  type: SyntaxTreeBranches;
  /** Type of the token we are starting */
  name: T;
  /**
   * The index of our token in our immediate parent's children.
   *
   * This doesn't need to be accurate as a separate routine runs
   * after key steps to make sure that this is correct.
   *
   * This makes it much easier to just write your code and not have
   * to sort out the potentially complex logic of this.
   */
  idx: number;
  /** Track problems for our tokens */
  parseProblems: IDLProblemCode[];
  /** Names of branch tokens that are our parents */
  scope: NonBasicTokenNames[];
  /** Actual branch tokens that are our parents */
  scopeTokens?: TreeToken<NonBasicTokenNames>[];
  /**
   * Access tokens that come before to be able to determine data type
   *
   * These include variables, properties, and a few other items as well
   */
  accessTokens?: TreeToken<TokenName>[];
  /**
   * Override for hover help in tokens, primarily allows for custom
   * hover help with routine docs.
   */
  hoverOverride?: IHoverOverride[];
  /**
   * Property to hold any user data.
   */
  cache?: any;
}

/** Basic branch with no children */
export interface IBasicBranch<T extends BasicTokenNames>
  extends IBranchBase<T> {
  name: T;
  type: SyntaxTreeBasic | SyntaxTreeUnknown;
  /** The position of our token as `[line, index, length]` */
  pos: PositionArray;
  /** Matches from regex. First is the entire match, any other elements are capture groups */
  match: TokenStartMatches<T>;
}

/**
 * Information about the start/end of a branch
 */
export interface IBranchEnd {
  /** The position of our token */
  pos: PositionArray;
  /** Matches from token extraction */
  match: TokenStartMatches<TokenName>;
}

/** Recursive branch with no children */
export interface IBranch<T extends NonBasicTokenNames> extends IBranchBase<T> {
  type: SyntaxTreeBranch;
  name: T;
  /** The position of our token */
  pos: PositionArray;
  /** Matches from regex. First is the entire match, any other elements are capture groups */
  match: TokenStartMatches<T>;
  /** End token, don't always have */
  end?: IBranchEnd;
  /** Children of our branch */
  kids: SyntaxTree;
}

/**
 * Types of tokens that we return
 */
export type TreeToken<T extends TokenName> = T extends BasicTokenNames
  ? IBasicBranch<T>
  : T extends NonBasicTokenNames
  ? IBranch<T>
  : never;

/**
 * Union type for all basic tokens
 */
export type TreeBasicToken = TreeToken<BasicTokenNames>;

/**
 * Union type for all branch tokens
 */
export type TreeBranchToken = TreeToken<NonBasicTokenNames>;

/**
 * Alias for syntax tree
 */
export type SyntaxTree = TreeToken<TokenName>[];

/**
 * Track tokens by the line that they are on
 */
export interface ITokensByLine {
  [key: number]: TokenizerToken<TokenName>[];
}

/**
 * Data structure for branch lookup
 */
interface IBranchLookup {
  /** Token has a start and end */
  BRANCH: SyntaxTreeBranch;
  /** Token has no children and is basic */
  BASIC: SyntaxTreeBasic;
  /** Unknown branch that we parsed */
  UNKNOWN: SyntaxTreeUnknown;
}

/**
 * Constant with lookup for branch types
 */
export const BRANCH_TYPES: IBranchLookup = {
  BRANCH: 0,
  BASIC: 1,
  UNKNOWN: 2,
};
