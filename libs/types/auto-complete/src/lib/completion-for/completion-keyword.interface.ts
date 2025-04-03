import { GlobalIndexedRoutineToken } from '@idl/types/core';

/**
 * Auto-complete for keywords
 */
export type KeywordCompletion = 'keyword';

/**
 * Options for adding keyword completion
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IKeywordCompletionOptions {
  /** text we add for binary */
  binaryAdd: string;
  /** Do we force binary keywords or not */
  forceBinary: boolean;
  /** Global token we come from */
  global?: GlobalIndexedRoutineToken;
  /** Keywords that we have already used */
  used: string[];
}
