import { IDLDataType } from '@idl/types/core';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';

/**
 * Auto-complete for function methods
 */
export type PropertyCompletion = 'property';

/**
 * Options for adding function method completion
 */
export interface IPropertyCompletionOptions {
  /**
   * Text we add on insert
   */
  add: string;
  /**
   * Data type to add types for
   */
  type: IDLDataType;
}

export interface IPropertyCompletionArg
  extends BuildCompletionItemsArg<PropertyCompletion> {
  /** Current methods that we have found */
  found?: { [key: string]: any };
}
