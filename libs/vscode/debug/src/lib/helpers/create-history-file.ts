import { IDL_DEBUG_ADAPTER_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_DEBUG_OUTPUT_CHANNEL, IDL_LOGGER } from '@idl/vscode/client';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { VariablesReferenceSubstitution } from '@idl/vscode/shared';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import { dirname, join } from 'path';

import { OUTPUT_CONFIG } from './log-output';

/**
 * Creates/manages the location of the output file for our console input/output
 */
export function CreateHistoryFile() {
  // check if our history file is enabled or not
  if (IDL_EXTENSION_CONFIG.IDL.history.enabled) {
    OUTPUT_CONFIG.FILE = join(
      VariablesReferenceSubstitution(IDL_EXTENSION_CONFIG.IDL.history.folder),
      IDL_EXTENSION_CONFIG.IDL.history.fileName
    );

    // add to normal log
    IDL_LOGGER.log({
      type: 'info',
      log: IDL_DEBUG_ADAPTER_LOG,
      content: `IDL session history file: ${OUTPUT_CONFIG.FILE}`,
    });

    // add in history log where we are located
    IDL_DEBUG_OUTPUT_CHANNEL.appendLine(
      `idl history '${OUTPUT_CONFIG.FILE}'\n`
    );

    try {
      // make folder if it does not exists
      if (!existsSync(dirname(OUTPUT_CONFIG.FILE))) {
        mkdirSync(dirname(OUTPUT_CONFIG.FILE), { recursive: true });
      }

      // check if we exists
      if (existsSync(OUTPUT_CONFIG.FILE)) {
        // check if we need to truncate contents
        if (
          IDL_EXTENSION_CONFIG.IDL.history.truncateOnStartup ||
          statSync(OUTPUT_CONFIG.FILE).size / (1024 * 124) >
            IDL_EXTENSION_CONFIG.IDL.history.maxSize
        ) {
          writeFileSync(OUTPUT_CONFIG.FILE, '');
        } else {
          appendFileSync(OUTPUT_CONFIG.FILE, '\n');
        }
      } else {
        writeFileSync(OUTPUT_CONFIG.FILE, '');
      }
    } catch (err) {
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.createHistory, err],
        alert: IDL_TRANSLATION.debugger.errors.createHistory,
      });

      // clear file
      OUTPUT_CONFIG.FILE = '';
    }
  } else {
    // clear in case we changed from last session
    OUTPUT_CONFIG.FILE = '';
  }
}
