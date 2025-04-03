import { IDL_LOG } from './log-names.interface';
import {
  FileLogMode,
  IBasicLogOptions,
  LogAlertCallback,
  LogLevel,
} from './logger.interface';

/**
 * Callback signature for our log interceptor
 */
export type LogInterceptor = (options: ILogOptions) => void;

/**
 * Options for creating our log manager
 */
export interface ILogManagerOptions {
  /** Callback for logs */
  alert: LogAlertCallback;
  /** Folder where we write our logs to */
  folder?: string;
  /** Level of log to print */
  logLevel?: LogLevel;
  /** How to handle existing log files */
  mode?: FileLogMode;
  /** Don't log anything */
  quiet?: boolean;
}

/**
 * Options when logging from the log manager
 */
export interface ILogOptions extends IBasicLogOptions {
  /** Name of the log we write to */
  log?: string;
}

/**
 * Default logging options
 */
export const DEFAULT_LOGGER_OPTIONS: ILogOptions = {
  type: 'info',
  content: undefined,
  log: IDL_LOG,
  // dont include alert message otherwise we always print since it is present
  // alert: IDL_TRANSLATION.logger.defaultErrorMessage,
};

/**
 * Data structure to track different kinds of messages in the logger
 */
export interface ILogManagerTracker {
  /** NUmber of errors */
  errors: number;
  /** Number of warnings */
  warnings: number;
}

/**
 * Default values for tracker
 */
export const DEFAULT_TRACKER: ILogManagerTracker = {
  errors: 0,
  warnings: 0,
};
