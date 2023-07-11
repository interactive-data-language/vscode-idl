import { IDL_DEBUG_OUTPUT_CHANNEL } from '@idl/vscode/client';

/**
 * Logs that a session has stopped
 */
export function LogSessionStop(reason: string) {
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine('');
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine(
    `idl ${reason} ${new Date().toISOString()}`
  );
}
