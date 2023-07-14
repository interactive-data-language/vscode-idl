import { IDL_DEBUG_OUTPUT_CHANNEL } from '@idl/vscode/client';

import { AddHistoryInput } from './add-history-input';
import { CreateHistoryFile } from './create-history-file';
import { OUTPUT_CONFIG } from './log-output';

/**
 * Logs output data being sent to IDL
 */
export function LogSessionStart() {
  // set as first for special formatting considerations
  OUTPUT_CONFIG.FIRST = true;

  // add empty space to separate
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine('');

  // make our log file (indicates which file we use for input/output)
  CreateHistoryFile();

  const toWrite = `idl started ${new Date().toISOString()}`;

  IDL_DEBUG_OUTPUT_CHANNEL.appendLine(toWrite);

  // write to our fil eon disk
  AddHistoryInput(toWrite);
}
