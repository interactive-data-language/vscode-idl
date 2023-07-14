import { IDL_DEBUG_ADAPTER_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/client';
import { appendFileSync } from 'fs';

import { OUTPUT_CONFIG } from './log-output';

/**
 * Adds text to our history file as raw text
 */
export function AddHistory(content: string) {
  // check if we need to write to our log file
  if (OUTPUT_CONFIG.FILE !== '') {
    try {
      appendFileSync(OUTPUT_CONFIG.FILE, content);
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
