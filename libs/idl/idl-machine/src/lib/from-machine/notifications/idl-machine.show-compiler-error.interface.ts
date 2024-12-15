/**
 * Notification that we have a compile error for a file
 */
export type ShowCompilerErrorNotification = 'showCompileError';

/** The parameters for compile errors */
export type CompilerOpenFileParams = {
  /** FIle with error */
  file: string;
  /** Line one-based */
  line: number;
  char: number;
  start: number;
};
