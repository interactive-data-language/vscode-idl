import { REGEX_NEW_LINE } from '@idl/idl';
import { IDL_DEBUG_OUTPUT_CHANNEL } from '@idl/vscode/client';

import { AddHistory } from './add-history';

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
  AddHistory(toWrite);
}
