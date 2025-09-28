import { IDLDataType } from '@idl/types/idl-data-types';

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
