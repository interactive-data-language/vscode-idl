import { IDL_DEBUG_OUTPUT_CHANNEL } from '@idl/vscode/client';

import { CreateOutputFile } from './create-output-file';
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
  CreateOutputFile();

  IDL_DEBUG_OUTPUT_CHANNEL.appendLine(
    `idl started ${new Date().toISOString()}`
  );
}
