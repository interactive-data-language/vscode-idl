/**
 * Regex to detect auto complete for special procedures
 */
export const SPECIAL_PROCEDURE_REGEX = /call_procedure/i;

/**
 * Auto-complete for special procedures
 */
export type SpecialProcedureCompletion = 'special-procedure';

/**
 * Options for adding special procedure completion
 */
export interface ISpecialProcedureCompletionOptions {
  /**
   * Flag if we can process special procedures or not
   */
  notSpecial: boolean;
}