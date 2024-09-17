/**
 * Auto-complete for special functions
 */
export type SpecialFunctionCompletion = 'special-function';

/**
 * Options for adding special function completion
 */
export interface ISpecialFunctionCompletionOptions {
  /**
   * Flag if we can process special procedures or not
   */
  notSpecial: boolean;
  /**
   * The value of the token when evaluated
   */
  value?: string;
  /**
   * Name of procedure we are calling, lower case
   */
  functionName?: string;
}
