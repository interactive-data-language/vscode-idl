import { IDLDataType } from '@idl/types/core';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';

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

export interface IFunctionMethodCompletionArg
  extends BuildCompletionItemsArg<FunctionMethodCompletion> {
  /** Current methods that we have found */
  found?: { [key: string]: any };
}
