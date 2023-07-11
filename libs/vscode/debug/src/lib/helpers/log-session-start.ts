import { IDL_DEBUG_OUTPUT_CHANNEL } from '@idl/vscode/client';

import { OUTPUT_CONFIG } from './log-output';

/**
 * Logs output data being sent to IDL
 */
export function LogSessionStart() {
  OUTPUT_CONFIG.FIRST = true;
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine('');
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine(
    `idl started ${new Date().toISOString()}`
  );
}
