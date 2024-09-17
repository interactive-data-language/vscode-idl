import { ILocalTokenLookup } from '@idl/parsing/syntax-tree';

/**
 * Auto-complete for variables
 */
export type VariableCompletion = 'variable';

/**
 * Options for adding variable completion
 */
export interface IVariableCompletionOptions {
  /**
   * Variables found within our token
   */
  lookup: ILocalTokenLookup;
}
