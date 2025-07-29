/**
 * Auto-complete for block statements like if-then-begin
 */
export type BlockCompletion = 'blocks';

/**
 * Options for adding blocks on auto-complete
 */
export interface IBlockCompletionOptions {
  /**
   * Beginning statement
   */
  beginning: string;
  /** Text we display */
  display: string;
  /** Type of end statement if known */
  ending?: string;
}
