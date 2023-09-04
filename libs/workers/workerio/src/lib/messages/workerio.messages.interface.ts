/**
 * Cancel/interrupt pending work
 */
export type CancelMessage = 'cancel';

/**
 * Error running process
 */
export type ErrorMessage = 'error';

/**
 * Error running process
 */
export type LogMessage = 'log';

/**
 * Unhandled error on client
 */
export type UnhandledError = 'unhandled-error';

/**
 * Base messages that are always supported with workerio
 */
export type WorkerIOBaseMessage =
  | CancelMessage
  | ErrorMessage
  | LogMessage
  | UnhandledError;
