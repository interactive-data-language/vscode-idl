import { TreeToken } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/tokenizer';

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
  /** Are we within a comment block? */
  commentBlock: boolean;
  /** indicates if we are a hanging line with custom indent */
  hangingIndentStart: number | undefined;
  /** If we should ignore line continuations that we encounter and not add indents */
  ignoreLineContinuation: boolean;
  /** Indent level for joining strings */
  indentLevel: number;
  /** If we found a line continuation beforehand */
  lineContinuation: boolean;
  /** Number of additional lines that we have created to split code up for long lines */
  lineOffset: number;
  /** The token before our current token */
  tokenBefore: TreeToken<TokenName> | undefined;
  /** The current parents */
  tokenParent: TreeToken<TokenName> | undefined;
}

/** Function tokens for customized property behavior */
export const HANGING_ROUTINES: { [key: string]: boolean } = {};
HANGING_ROUTINES[TOKEN_NAMES.CALL_FUNCTION] = true;
HANGING_ROUTINES[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
HANGING_ROUTINES[TOKEN_NAMES.CALL_PROCEDURE] = true;
HANGING_ROUTINES[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;
HANGING_ROUTINES[TOKEN_NAMES.ROUTINE_NAME] = true;
HANGING_ROUTINES[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;
HANGING_ROUTINES[TOKEN_NAMES.PARENTHESES] = true;
HANGING_ROUTINES[TOKEN_NAMES.BRACKET] = true;
HANGING_ROUTINES[TOKEN_NAMES.STRUCTURE] = true;
