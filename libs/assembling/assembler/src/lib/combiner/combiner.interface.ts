import { TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/parsing/tokenizer';

/**
 * Track the strings by line
 */
export interface IStringsByLine {
  [key: number]: string[];
}

/**
 * Options for the combiner when we recurse
 */
export interface ICombinerRecursionOptions {
  /** Indent level for joining strings */
  indentLevel: number;
  /** If we found a line continuation beforehand */
  lineContinuation: boolean;
  /** If we should ignore line continuations that we encounter and not add indents */
  ignoreLineContinuation: boolean;
  /** Are we within a comment block? */
  commentBlock: boolean;
  /** Number of additional lines that we have created to split code up for long lines */
  lineOffset: number;
  /** The token before our current token */
  tokenBefore: TreeToken<TokenName> | undefined;
  /** The current parents */
  tokenParent: TreeToken<TokenName> | undefined;
}
