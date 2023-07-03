import { IDL_COMMAND_LOG } from '@idl/logger';

import { IDL_LOGGER } from '../initialize-client';

/**
 * Logs an information statement to the IDL command log
 */
export function LogCommandInfo(msg: string) {
  IDL_LOGGER.log({
    log: IDL_COMMAND_LOG,
    content: msg,
    type: 'info',
  });
}

/**
 * Logs error information to the IDL command log and alerts the user that an error
 * happened
 */
export function LogCommandError(msg: string, err: any, alertMessage: string) {
  IDL_LOGGER.log({
    log: IDL_COMMAND_LOG,
    content: [msg, err],
    type: 'error',
    alert: alertMessage,
  });
}
