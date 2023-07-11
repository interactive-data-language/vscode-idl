import { REGEX_NEW_LINE } from '@idl/idl';
import { IDL_DEBUG_OUTPUT_CHANNEL } from '@idl/vscode/client';

/**
 * Config for the output
 */
export const OUTPUT_CONFIG = {
  /**
   * Track if first thing logged after a new line or not
   */
  FIRST: false,
};

/**
 * Logs output data being sent to IDL
 */
export function LogOutput(content: string) {
  if (OUTPUT_CONFIG.FIRST) {
    IDL_DEBUG_OUTPUT_CHANNEL.append(
      `  ${content.replace(REGEX_NEW_LINE, '\n  ')}`
    );
    OUTPUT_CONFIG.FIRST = false;
  } else {
    IDL_DEBUG_OUTPUT_CHANNEL.append(content.replace(REGEX_NEW_LINE, '\n  '));
  }
}
