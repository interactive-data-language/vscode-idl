import { IParsed, ParsedType } from '@idl/parsing/syntax-tree';
import { Patch } from 'fast-array-diff';

/**
 * Options for parsing
 */
export interface IParserOptions {
  /**
   * Do we do a full parse or not?
   */
  full: boolean;
  /**
   * Do we cleanup and reduce memory usage by removing properties we dont need?
   */
  cleanup: boolean;
  /**
   * Are we parsing a notebook cell? This need to be manually set when interacting
   * directly with the `Parser()`, but from the IDLIndex it is set automatically
   */
  type: ParsedType;
  /**
   * If we are cleaning up, do we keep the text?
   */
  keepText: boolean;
  /**
   * Changes made from previous version of the document
   */
  changes?: {
    /** Diffs from original */
    delta: Patch<string>;
    /** Original code */
    original: string[];
  };
  /**
   * Previous syntax tree that we are editing/replacing
   */
  previous?: IParsed;
  /**
   * Do we only parse code and build the syntax tree, nothing else?
   */
  onlyParse?: boolean;
}

/**
 * Options for parsing
 */
export const DEFAULT_PARSER_OPTIONS: IParserOptions = {
  full: true,
  cleanup: true,
  type: 'pro',
  keepText: false,
};
