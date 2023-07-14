import { IDL_DEBUG_OUTPUT_CHANNEL } from '@idl/vscode/client';

import { AddHistoryInput } from './add-history-input';

/**
 * Logs that a session has stopped
 */
export function LogSessionStop(reason: string) {
  const toWrite = `idl ${reason} ${new Date().toISOString()}`;
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine('');
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine('');
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine(toWrite);

  // log to our file
  AddHistoryInput(toWrite);
}
