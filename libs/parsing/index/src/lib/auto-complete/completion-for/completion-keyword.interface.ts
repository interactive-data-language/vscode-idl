import { GlobalIndexedRoutineToken } from '@idl/types/core';

/**
 * Auto-complete for keywords
 */
export type IncludeCompletion = 'keyword';

/**
 * Options for adding keyword completion
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IKeywordCompletionOptions {
  /** Global token we come from */
  global?: GlobalIndexedRoutineToken;
  /** Keywords that we have already used */
  used: string[];
  /** text we add for binary */
  binaryAdd: string;
  /** Do we force binary keywords or not */
  forceBinary: boolean;
}
