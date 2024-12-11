/**
 * Notification that the interpreter has stopped
 */
export type InterpreterStoppedNotification = 'interpreterStopped';

/** Parameters for when a command has stopped */
export type InterpreterStoppedParams = {
  /** File we stopped in */
  file: string;
  /** Routine we stopped in */
  routine: string;
  /** Line number (one based) that we stopped on */
  line: number;
  /** The reason we set */
  errorCode: number;
};
