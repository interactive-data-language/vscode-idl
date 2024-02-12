import { PositionArray } from '@idl/types/tokenizer';

import { TokenStartMatches } from './token-matches.interface';
import { ITokenDef, TOKEN_NAMES, TokenName } from './tokens.interface';
import { ALL_TOKENS, DEFAULT_TOKENS } from './tokens/def-groups.interface';
import { COMMENT } from './tokens/defs/comment.interface';
import { ROUTINE_DEF } from './tokens/defs/routines.definition.interface';
import { STRUCTURE } from './tokens/defs/structure.interface';
import { ISubTokenDefs, SUB_DEFS } from './tokens/sub-defs.interface';
import { SUB_DEFS_FAST } from './tokens/sub-defs-fast.interface';

/** Position of a token */
export interface IPosition {
  /** Line number we start on */
  line: number;
  /** Line number that we finish */
  index: number;
}

/**
 * Options to customize how we find tokens
 */
export interface IFindTokensOptions {
  /** The expressions that we are matching */
  defs: ITokenDef<TokenName>[];
  /** Sub definitions that we can find */
  subDefs: ISubTokenDefs;
  /** Default tokens to search for */
  default: ITokenDef<TokenName>[];
  /** Are we doing a full parse or not */
  full: boolean;
  /** What feature are we trying to close */
  closer?: ITokenDef<TokenName>;
  /** ID of the closer */
  _closerId?: string;
  /**
   * Token type for the closer, matches the start. A part of this is to
   * support dynamic token types.
   */
  _closerTokenName?: TokenName;
}

/**
 * Default options for finding tokens
 */
export const DEFAULT_FIND_TOKEN_OPTIONS: IFindTokensOptions = {
  defs: ALL_TOKENS,
  subDefs: SUB_DEFS,
  default: DEFAULT_TOKENS,
  full: true,
};

/**
 * Default options for finding tokens
 */
export const FAST_FIND_TOKEN_OPTIONS: IFindTokensOptions = {
  defs: [COMMENT, ROUTINE_DEF],
  subDefs: SUB_DEFS_FAST,
  // even though structure is deprecated, use it as it is a simpler regex expression
  default: [COMMENT, ROUTINE_DEF, STRUCTURE],
  full: false,
};

/**
 * Structure to store all the information about our match
 */
export interface IDetailedPosition extends IPosition {
  length: number;
}

/** Basic token with no closing statement */
export type BasicToken = 0;
/* Start of a multi-part token */
export type StartToken = 1;
/** End of a multi-part token */
export type EndToken = 2;

/** Types of tokens that we can match */
export type FoundTokenType = BasicToken | StartToken | EndToken;

/**
 * Strictly typed interface for constant of allowed token tupes
 */
export interface ITokenTypes {
  BASIC: BasicToken;
  START: StartToken;
  END: EndToken;
}

/**
 * Allowed types of tokens
 */
export const TOKEN_TYPES: ITokenTypes = {
  BASIC: 0,
  START: 1,
  END: 2,
};

/**
 * Token information with matches and location information removed.
 *
 * Primarily used for tests
 */
export interface IBaseTokenWithoutMatches<T extends TokenName> {
  /** Category of token we are checking */
  type: FoundTokenType;
  /** Type of the token we are starting */
  name: T;
  /** The position of our token */
  pos: PositionArray;
}

/** Base data structure for tokens */
export interface IBaseToken<T extends TokenName>
  extends IBaseTokenWithoutMatches<T> {
  /**
   * Matches from regex. First is the entire match, any other elements are capture groups.
   *
   * Specifics for the number of captures and what they represent can be found in the
   * declaration for TokenStartMatches in token-matches.interface.ts
   */
  matches: TokenStartMatches<T>;
}

/**
 * For tokens that have no counterparts
 */
export interface IBasicToken<T extends TokenName> extends IBaseToken<T> {
  type: BasicToken;
}

export interface IPairedToken<T extends TokenName> extends IBaseToken<T> {
  /** ID for our start/end */
  _id: string;
}

/**
 * Token that is the start of a block/compound statement
 */
export interface IStartToken<T extends TokenName> extends IPairedToken<T> {
  type: StartToken;
}

/**
 * Token that is the end of a block/compound statement
 */
export interface IEndToken<T extends TokenName> extends IPairedToken<T> {
  type: EndToken;
}

/**
 * Types of tokens that can be found
 */
export type TokenizerToken<T extends TokenName> =
  | IBasicToken<T>
  | IStartToken<T>
  | IEndToken<T>;

/**
 * Data structure for tokens that we find
 */
export interface IFoundTokens {
  /** Flat array of tokens */
  tokens: TokenizerToken<TokenName>[];
  /** Number of lines of code */
  lines: number;
  /**
   * Actual text for the code that we extracted tokens from. This
   * text MAY NOT EXIST and gets cleared to reduce memory usage.
   */
  text: string[];
}

/**
 * Lookup of tokens that we want to preserve white space within.
 *
 * This means we do not shift through empty space which is the default
 */
export const PRESERVE_INTERIOR_SPACE: { [key: string]: boolean } = {};
PRESERVE_INTERIOR_SPACE[TOKEN_NAMES.QUOTE_DOUBLE] = true;
PRESERVE_INTERIOR_SPACE[TOKEN_NAMES.QUOTE_SINGLE] = true;
PRESERVE_INTERIOR_SPACE[TOKEN_NAMES.STRING_TEMPLATE_LITERAL] = true;

/**
 * When we close these tokens, also close our parents
 */
export const CLOSE_PARENTS_ON_CLOSE: { [key: string]: boolean } = {};
CLOSE_PARENTS_ON_CLOSE[TOKEN_NAMES.BLOCK] = true;
CLOSE_PARENTS_ON_CLOSE[TOKEN_NAMES.LOOP_DO] = true;

/**
 * Specific tokens, edge cases, that should not have the parent automatically closed
 * when the child finishes
 */
export const NO_AUTO_CLOSE: { [key: string]: boolean } = {};
NO_AUTO_CLOSE[TOKEN_NAMES.LOOP_REPEAT] = true;
