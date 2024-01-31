import * as chalk from 'chalk';

import { Logger } from './logger.class';

// simple type for what types we are allowed to print
export type LogType = 'debug' | 'info' | 'log' | 'warn' | 'error';

/** When logging to files, how do we handle existing logs? */
export type FileLogMode = 'append' | 'truncate';

/**
 * Level of importance for log, used to filter which logs we do or dont want
 */
export type LogLevel = -1 | 0 | 1 | 2 | 3 | 4;

/**
 * Logging levels used for filtering out messages that we don't care about
 */
interface ILogLevels {
  [key: string]: LogLevel;
  any: LogLevel;
  log: LogLevel;
  info: LogLevel;
  warn: LogLevel;
  error: LogLevel;
  debug: LogLevel;
}

/**
 * Logging levels used for filtering out messages that we don't care about
 */
export const LOG_LEVELS: ILogLevels = {
  any: -1,
  log: 0,
  info: 1,
  warn: 2,
  error: 3,
  debug: 4,
};

/**
 * Configuration values for how logging works. These, in addition to the PRETTY
 * and UGLY LOG_NAMES should give you all the control you need over this
 */
export const LOGGING_CONFIG = {
  /**
   * When printing objects, we use utils for coloring and this indicates
   * the depth that utils will go to for objects/arrays/etc.
   */
  UTILS_LEVEL: 3,
  /**
   * When printing more than one item, how large should the indent be
   * to make them easier to find compared to items on the far-left.
   *
   * This is the initial value, it can be changed via the `indent` property
   * on the logger.
   */
  INDENT: '  ',
  /**
   * Lowest log level to print, anything higher than this gets printed but everything lower is
   * ignored.
   *
   * Only utilized if working with the log manager, otherwise this is not used in the Logger
   */
  LOG_LEVEL: LOG_LEVELS.any,
  /**
   * When writing to files, how do we handle them by default?
   */
  FILE_LOG_MODE: 'append' as FileLogMode,
};

/**
 * Default information for log names
 */
interface ILogNames {
  [key: string]: string;
  debug: string;
  error: string;
  info: string;
  log: string;
  warn: string;
}

/**
 * Names of logs with coloring applied
 */
export const PRETTY_LOG_NAMES: ILogNames = {
  debug: chalk.blue('debug'),
  error: chalk.red('error'),
  info: chalk.cyan('info'),
  log: chalk.white('log'),
  warn: chalk.yellow('warn'),
};

/**
 * Names of logs without coloring applied
 */
export const UGLY_LOG_NAMES: ILogNames = {
  debug: 'debug',
  error: 'error',
  info: 'info',
  log: 'log',
  warn: 'warn',
};

/**
 * Data structure for storing different logs
 */
export interface ILogs {
  [key: string]: Logger;
}

/**
 * Options when logging from the logger
 */
export interface IBasicLogOptions {
  /** Type of log */
  type?: LogType;
  /** Content to log, scalar or array */
  content: any | any[];
  /** Do we have a message to alert users with */
  alert?: string;
  /** Metadata for alert */
  alertMeta?: {
    /** If present and we have an alert, opens the specified file */
    openFile?: string;
    /** Filepath for a markdown file to display */
    openDocsURL?: string;
    /** A file to open */
    file?: string;
    /** If set, add a message to ask for the IDL directory */
    idlLoc?: boolean;
    /** If we need to ask user to initialize config for a folder */
    initConfig?: {
      /** Folder to initialize */
      folder: string;
    };
  };
}

/**
 * Callback when we have an alert message to send to the user
 */
export type LogAlertCallback = (options: IBasicLogOptions) => void;
