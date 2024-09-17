import { IDLDataType } from '@idl/types/core';

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
