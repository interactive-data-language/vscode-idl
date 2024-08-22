import {
  CommentBlockToken,
  CommentToken,
  ITokenDef,
  TOKEN_NAMES,
} from '../../tokens.interface';

/**
 * Token definition for comment
 */
export type CommentTokenDef = ITokenDef<CommentToken>;

/**
 * For matching comments
 */
export const COMMENT: CommentTokenDef = {
  name: TOKEN_NAMES.COMMENT,
  match: /;\s*.*$/im,
};

/**
 * Comment match
 *
 * @param {string} full Full match including the start of the comment
 */
export type CommentMatches = [full: string];

/**
 * Token definition for comment blocks
 */
export type CommentBlockTokenDef = ITokenDef<CommentBlockToken>;

/**
 * For matching comment blocks
 */
export const COMMENT_BLOCK: CommentBlockTokenDef = {
  name: TOKEN_NAMES.COMMENT_BLOCK,
  match: /;+/im,
  end: /;-/im,
};

/**
 * Comment block (something with indicator for docs) matches. The matches are
 * simply just an array of the strings extracted from the comments in the block
 */
export type CommentBlockMatches = string[];
