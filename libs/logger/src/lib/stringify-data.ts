import * as util from 'util';

import { LOGGING_CONFIG } from './logger.interface';

/**
 * Converts data to a string and indicates if we should do any formatting or not
 */
export function StringifyData(data: any, color = true) {
  if (typeof data === 'string') {
    return data.replace(/\r?\n|\r/g, `\n${LOGGING_CONFIG.INDENT}`);
  } else {
    return util
      .inspect(data, undefined, LOGGING_CONFIG.UTILS_LEVEL, color)
      .replace(/\r?\n|\r/g, `\n${LOGGING_CONFIG.INDENT}`);
  }
}

/**
 * Stringifies data for printing to a log and includes the log name
 */
export function StringifyDataForLog(
  front: string,
  data: any,
  indent = false,
  color = true
) {
  // get the strings that we actually want to write
  const toWrite = `${front} ${StringifyData(data, color)}`;

  // check if we need to indent our logged output or not
  if (indent) {
    return `${LOGGING_CONFIG.INDENT}${toWrite}`;
  } else {
    return toWrite;
  }
}
