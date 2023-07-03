import {
  CommentBlockToken,
  CommentToken,
  ITokenDef,
  TOKEN_NAMES,
} from '../../tokens.interface';

export type CommentTokenDef = ITokenDef<CommentToken>;

/**
 * For matching comments
 */
export const COMMENT: CommentTokenDef = {
  name: TOKEN_NAMES.COMMENT,
  match: /;\s*(TODO:)?(.*)$/im,
};

/**
 * Comment match without TODO
 *
 * @param {string} full Full match including the start of the comment
 * @param {string} comment Text after the semi-colon
 */
export type CommentMatches = [full: string, comment: string];

/**
 * Comment match with TODO
 *
 * @param {string} full Full match including the start of the comment
 * @param {string} todo TODO text, including semi-colon
 * @param {string} comment Statement to do
 */
export type CommentWithToDoMatches = [
  full: string,
  todo: string,
  comment: string
];

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
