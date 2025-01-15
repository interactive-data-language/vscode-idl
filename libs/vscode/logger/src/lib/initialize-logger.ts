import { IDL_CONSOLE, LogAlertCallback, LogManager } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';

/**
 * Replace console logs to capture all content and normalize output logging
 */
console.log = (...args: any[]) => {
  IDL_LOGGER.log({
    log: IDL_CONSOLE,
    content: args,
  });
};
console.warn = (...args: any[]) => {
  IDL_LOGGER.log({
    log: IDL_CONSOLE,
    content: args,
    type: 'warn',
  });
};
console.error = (...args: any[]) => {
  IDL_LOGGER.log({
    log: IDL_CONSOLE,
    content: args,
    type: 'error',
    alert: IDL_TRANSLATION.client.errors.unhandled,
  });
};

/**
 * Our logger to handle logic of logging to disk
 */
export let IDL_LOGGER: LogManager;

/**
 * Initializes the logger class
 */
export function InitializeLogger(alert: LogAlertCallback) {
  // create log
  IDL_LOGGER = new LogManager({
    alert,
  });
}
