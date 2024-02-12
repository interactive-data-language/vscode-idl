import {
  IHoverOverride,
  SyntaxTreeBasic,
  SyntaxTreeBranch,
  SyntaxTreeUnknown,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  BasicTokenNames,
  NonBasicTokenNames,
  TokenName,
  TokenStartMatches,
} from '@idl/parsing/tokenizer';
import { IDLProblemCode } from '@idl/types/problem-codes';
import { PositionArray } from '@idl/types/tokenizer';

/**
 * Metadata for any node in our syntax tree
 */
interface BasicTreeMetadata {
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

/**
 * Token position array
 */
type TokenPosition<T extends TokenName> = [
  pos: PositionArray,
  match: TokenStartMatches<T>
];

/**
 * Data structure for our syntax tree
 */
export type MiniTreeBasic<T extends BasicTokenNames> = [
  /**
   * Index in the tree so we have a reference and can jump around
   */
  idx: number,
  /**
   * Type of the node
   */
  type: SyntaxTreeBasic | SyntaxTreeUnknown,
  /**
   * Name of the node
   */
  name: T,
  /**
   * Indexes for parent tokens, all should be branches
   */
  scope: number[],
  /**
   * The matches for our token
   */
  matches: [start: TokenPosition<T>],
  /**
   * Any problems that our token has
   */
  problems: IDLProblemCode[],
  /**
   * Metadata for the current node in our tree
   */
  metadata: BasicTreeMetadata
];

/**
 * Data structure for our syntax tree
 */
export type MiniTreeBranch<T extends NonBasicTokenNames> = [
  /**
   * Index in the tree so we have a reference and can jump around
   */
  idx: number,
  /**
   * Type of the node
   */
  type: SyntaxTreeBranch,
  /**
   * Name of the node
   */
  name: T,
  /**
   * Indexes for parent tokens, all should be branches
   */
  scope: number[],
  /**
   * The matches for our token
   */
  matches: [start: TokenPosition<T>, end?: TokenPosition<any>],
  /**
   * Any problems that our token has
   */
  problems: IDLProblemCode[],
  /**
   * Metadata for the current node in our tree
   */
  metadata: BasicTreeMetadata,
  /**
   * The kids for our branch
   */
  kids: MiniTree
];

/**
 * Types of tokens that we return
 */
export type MiniTreeToken<T extends TokenName> = T extends BasicTokenNames
  ? MiniTreeBasic<T>
  : T extends NonBasicTokenNames
  ? MiniTreeBranch<T>
  : never;

/**
 * Alias for mini syntax tree
 */
export type MiniTree = MiniTreeToken<TokenName>[];
