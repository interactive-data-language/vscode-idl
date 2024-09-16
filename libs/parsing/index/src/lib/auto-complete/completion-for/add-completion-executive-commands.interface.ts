/**
 * Auto-complete for executive commands
 */
export type ExecutiveCommandCompletion = 'executive-command';

/**
 * Options for adding executive commands
 */
export interface IExecutiveCommandCompletionOptions {
  /**
   * Are we in a compile statement?
   */
  isCompile: boolean;
  /**
   * Do we send files or not?
   */
  addFiles: boolean;
}
