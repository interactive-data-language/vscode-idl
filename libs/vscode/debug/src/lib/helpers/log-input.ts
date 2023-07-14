import { REGEX_NEW_LINE } from '@idl/idl';
import { IDL_DEBUG_OUTPUT_CHANNEL } from '@idl/vscode/client';

import { AddHistoryInput } from './add-history-input';
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

  // write to our fil eon disk
  AddHistoryInput(toWrite);
}
