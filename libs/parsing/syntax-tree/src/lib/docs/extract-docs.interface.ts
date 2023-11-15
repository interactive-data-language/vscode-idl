import { CommentToken } from '@idl/parsing/tokenizer';
import { PositionArray } from '@idl/parsing/tokenizer-types';

import { IBasicBranch } from '../branches.interface';

/**
 * Regex to replace the start of a comment with empty spaces and account for start/end of comment blocks
 */
export const REMOVE_COMMENT_REGEX = /^;(\s*\+)?/i;

/**
 * Indicates the start of a comment block
 */
export const START_COMMENT_BLOCK = /^\s*;\s*\+/i;

/**
 * Test for the end of a comment block to exclude this line from the docs
 */
export const END_COMMENT_BLOCK_REGEX = /^;\s*-\s*$/i;

/**
 * Type for header docs
 */
export type HeaderDocsType = 'idldoc' | 'idldoc-legacy';

/**
 * Data structure for header documentation
 */
export interface IHeaderDocs {
  /** Starting position */
  pos: PositionArray;
  /** Matches from our regex */
  matches: string[];
  /** End position */
  end: PositionArray;
  /** The docs for the section */
  docs: string[];
  /** Original source comments so we can work magic to get back to source for feedback */
  comments: IBasicBranch<CommentToken>[];
  /** Type of docs block */
  type: HeaderDocsType;
}

/**
 * Data structure for docs. Key based with the IDL docs tags
 */
export interface IDocs {
  [key: string]: IHeaderDocs;
}
