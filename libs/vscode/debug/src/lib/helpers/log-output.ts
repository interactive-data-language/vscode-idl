import { REGEX_NEW_LINE } from '@idl/idl';
import { IDL_DEBUG_ADAPTER_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_DEBUG_OUTPUT_CHANNEL, IDL_LOGGER } from '@idl/vscode/client';
import { appendFileSync } from 'fs';

/**
 * Config for the output
 */
export const OUTPUT_CONFIG = {
  /**
   * Track if first thing logged after a new line or not
   */
  FIRST: false,
  /**
   * File that we write our output to
   */
  FILE: '',
};

/**
 * Logs output data being sent to IDL
 */
export function LogOutput(content: string) {
  const toWrite = OUTPUT_CONFIG.FIRST
    ? `  ${content.replace(REGEX_NEW_LINE, '\n  ')}`
    : content.replace(REGEX_NEW_LINE, '\n  ');

  // check how to write to our output channel
  if (OUTPUT_CONFIG.FIRST) {
    IDL_DEBUG_OUTPUT_CHANNEL.append(toWrite);
    OUTPUT_CONFIG.FIRST = false;
  } else {
    IDL_DEBUG_OUTPUT_CHANNEL.append(toWrite);
  }

  // check if we need to write to our log file
  if (OUTPUT_CONFIG.FILE !== '') {
    try {
      appendFileSync(OUTPUT_CONFIG.FILE, toWrite);
    } catch (err) {
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.addHistory, err],
        alert: IDL_TRANSLATION.debugger.errors.addHistory,
      });
      OUTPUT_CONFIG.FILE = '';
    }
  }
}
