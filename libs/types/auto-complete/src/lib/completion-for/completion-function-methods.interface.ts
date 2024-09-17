import { IDLDataType } from '@idl/types/core';

/**
 * Auto-complete for function methods
 */
export type FunctionMethodCompletion = 'function-method';

/**
 * Options for adding function method completion
 */
export interface IFunctionMethodCompletionOptions {
  /**
   * Do we add parentheses or not
   */
  addParen: boolean;
  /**
   * Data type to add types for
   */
  type: IDLDataType;
}
