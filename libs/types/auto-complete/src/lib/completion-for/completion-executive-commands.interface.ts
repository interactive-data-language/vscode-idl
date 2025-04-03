/**
 * Auto-complete for executive commands
 */
export type ExecutiveCommandCompletion = 'executive-command';

/**
 * Options for adding executive commands
 */
export interface IExecutiveCommandCompletionOptions {
  /**
   * Do we send files or not?
   */
  addFiles: boolean;
  /**
   * Are we in a compile statement?
   */
  isCompile: boolean;
}
