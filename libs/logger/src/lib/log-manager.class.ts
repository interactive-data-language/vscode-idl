import { DEFAULT_IDL_EXTENSION_CONFIG } from '@idl/vscode/extension-config';

import {
  DEFAULT_LOGGER_OPTIONS,
  ILogManagerOptions,
  ILogOptions,
  LogInterceptor,
} from './log-manager.interface';
import { ALL_IDL_LOGS, IDL_LOG } from './log-names.interface';
import { Logger } from './logger.class';
import {
  FileLogMode,
  LogAlertCallback,
  LOGGING_CONFIG,
  LogLevel,
} from './logger.interface';
import { ObjectifyError } from './objectify-error';

/**
 * Class for managing many logs!
 *
 * It justs collects logs, amkes them as needed, and is the central place
 * that they can be stored.
 *
 * Manages log collections with the ability to do console and/or file logging.
 */
export class LogManager implements ILogManagerOptions {
  debug = DEFAULT_IDL_EXTENSION_CONFIG.debugMode;

  /** How do we handle existing logs? */
  mode: FileLogMode = LOGGING_CONFIG.FILE_LOG_MODE;

  /**
   * Log level that we filter/exclude from the console and files
   */
  logLevel: LogLevel = LOGGING_CONFIG.LOG_LEVEL;

  /** If we should ignore all logs */
  quiet = false;

  /** All of the different logs that we manage */
  logs: { [key: string]: Logger } = {};

  /** optionally set a log interceptor to interrupt any logging messages */
  private interceptor?: LogInterceptor;

  /** Callback when we have an error */
  alert: LogAlertCallback;

  constructor(options: ILogManagerOptions, addLogs: string[] = ALL_IDL_LOGS) {
    Object.assign(this, options);

    // add all logs
    for (let i = 0; i < addLogs.length; i++) {
      this.addLog(addLogs[i]);
    }
  }

  /**
   * Sets quiet flag for all of our logs and enables or disables
   * console printing
   */
  setQuiet(flag: boolean) {
    const logs = Object.values(this.logs);
    for (let i = 0; i < logs.length; i++) {
      logs[i].quiet = flag;
    }
  }

  /**
   * Updates internal preferences based on our configuration.
   *
   * Called when our configuration changes.
   */
  setDebug(flag: boolean) {
    this.debug = flag;

    // update all of our logs
    const logs = Object.values(this.logs);
    for (let i = 0; i < logs.length; i++) {
      logs[i].enableDebugLogs = this.debug;
    }
  }

  /**
   * Set log interceptor for everyone
   */
  setInterceptor(interceptor?: LogInterceptor) {
    this.interceptor = interceptor;

    // update all of our logs
    const logs = Object.values(this.logs);
    for (let i = 0; i < logs.length; i++) {
      logs[i].interceptor = interceptor;
    }
  }

  /**
   * Updates all logs to do fancy or basic logging
   */
  setUgly(flag: boolean) {
    const logs = Object.values(this.logs);
    for (let i = 0; i < logs.length; i++) {
      logs[i].logUgly = flag;
    }
  }

  /**
   * Adds a log to the manager that we can write to.
   *
   * Cleans up existing logs if one exists with the same name.
   *
   * @param {string} name The name of the log to add to our manager, case sensitive
   */
  addLog(name: string) {
    // clean up existing log
    if (name in this.logs) {
      this.logs[name].destroy();
    }
    this.logs[name] = new Logger(name, this.debug, (options) =>
      this.alert(options)
    );
  }

  /**
   * Gets a log with the specified name and, if it does not exist, makes it
   *
   * @param {string} name The name of the log to retrieve, case sensitive
   */
  getLog(name: string): Logger {
    // make it if it doesnt exist
    if (!(name in this.logs)) {
      this.addLog(name);
    }

    // return log
    return this.logs[name];
  }

  /**
   * Log content for a specific log
   *
   * @param {string} name The name of the log to write to, only logs if it exists
   * @param {LogType} type The type of information we are logging.
   * @param {(any | any[])} data The data to log
   * @param {boolean} [toFile=true] If configured for writing to files, do we also write to files?
   * @memberof LogManager
   */
  log(options: ILogOptions) {
    // return if debug and not debug
    if (options?.type === 'debug' && !this.debug) {
      return;
    }

    // check if we have
    if (this.interceptor !== undefined) {
      // get data we are sending
      const data = options.content;

      // always have an array that we log
      const useData = !Array.isArray(data) ? [data] : data;

      // replace any error objects
      for (let i = 0; i < useData.length; i++) {
        if (useData[i] instanceof Error) {
          useData[i] = ObjectifyError(useData[i]);
        }
      }

      // update property
      options.content = useData;

      // call our interceptor
      this.interceptor(options);

      // check if we have an alert to listen for
      if (options.alert) {
        this.alert(options);
      }

      // return and dont do what we have below
      return;
    }

    // merge our options with the defaults
    const useOptions = { ...DEFAULT_LOGGER_OPTIONS, ...options };

    // get the lower case name
    const useName = useOptions.log.toLowerCase();

    // check how to proceed
    switch (true) {
      case useName in this.logs:
        this.logs[useName].log(useOptions);
        break;
      default:
        // alert user
        this.logs[IDL_LOG].error(`Unknown log "${useName}"`);
        this.logs[IDL_LOG].log(useOptions);
        break;
    }
  }
}
