import { REGEX_NEW_LINE } from '@idl/idl';
import { IDL_DEBUG_OUTPUT_CHANNEL } from '@idl/vscode/client';

import { OUTPUT_CONFIG } from './log-output';

/**
 * Logs input data being sent to IDL
 */
export function LogInput(code: string) {
  OUTPUT_CONFIG.FIRST = true;
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine('');
  IDL_DEBUG_OUTPUT_CHANNEL.appendLine(
    `idl input ${code.replace(REGEX_NEW_LINE, '\n  ')}`
  );
}
