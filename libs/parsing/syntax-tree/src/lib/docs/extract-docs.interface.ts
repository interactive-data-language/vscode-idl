import { CommentToken } from '@idl/tokenizer';
import { PositionArray } from '@idl/types/tokenizer';

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
export type HeaderDocsType = 'idldoc-legacy' | 'idldoc';

/**
 * Data structure for header documentation
 */
export interface IHeaderDocs {
  /** Original source comments so we can work magic to get back to source for feedback */
  comments: IBasicBranch<CommentToken>[];
  /** The docs for the section */
  docs: string[];
  /** End position */
  end: PositionArray;
  /** Matches from our regex */
  matches: string[];
  /** Starting position */
  pos: PositionArray;
  /** Type of docs block */
  type: HeaderDocsType;
}

/**
 * Data structure for docs. Key based with the IDL docs tags
 */
export interface IDocs {
  [key: string]: IHeaderDocs;
}
