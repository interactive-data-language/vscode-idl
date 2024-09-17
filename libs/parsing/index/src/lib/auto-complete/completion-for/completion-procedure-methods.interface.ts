import { IDLDataType } from '@idl/types/core';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';

/**
 * Auto-complete for procedure methods
 */
export type ProcedureMethodCompletion = 'procedure-method';

/**
 * Options for adding procedure method completion
 */
export interface IProcedureMethodCompletionOptions {
  /**
   * Data type to add types for
   */
  type: IDLDataType;
}

export interface IProcedureMethodCompletionArg
  extends BuildCompletionItemsArg<ProcedureMethodCompletion> {
  /** Current methods that we have found */
  found?: { [key: string]: any };
}
