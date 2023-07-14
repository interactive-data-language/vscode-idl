import { REGEX_NEW_LINE } from '@idl/idl';
import { IDL_DEBUG_ADAPTER_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_DEBUG_OUTPUT_CHANNEL, IDL_LOGGER } from '@idl/vscode/client';
import { appendFileSync } from 'fs';

import { OUTPUT_CONFIG } from './log-output';

/**
 * Logs input data being sent to IDL
 */
export function LogInput(code: string) {
  // update flag that we have first input
  OUTPUT_CONFIG.FIRST = true;

  const toWrite = `idl input ${code.replace(REGEX_NEW_LINE, '\n  ')}`;

  // append new line
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine('');
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine('');
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine(toWrite);

  // check if we need to write to our log file
  if (OUTPUT_CONFIG.FILE !== '') {
    try {
      appendFileSync(OUTPUT_CONFIG.FILE, `\n\n${toWrite}\n`);
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
