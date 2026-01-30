import { IENVISuccess } from '@idl/types/vscode-debug';
import {
  IDebugEvaluateOptions,
  IDL_DEBUG_ADAPTER,
  LAST_ENVI_SUCCESS_MESSAGE,
} from '@idl/vscode/debug';

/**
 * Default success message for returning in case we don't have
 * one
 */
const DEFAULT_SUCCESS: IENVISuccess = {
  succeeded: false,
};

/**
 * Runs an MCP command and returns the output combined with the
 * latest status message from ENVI
 */
export async function MCPEvaluateENVICommand(
  command: string,
  options?: IDebugEvaluateOptions
) {
  /**
   * Run command and save IDL output
   */
  const idlOutput = await IDL_DEBUG_ADAPTER.evaluate(command, options);

  /**
   * Combine response information
   */
  const res: IENVISuccess = {
    ...(LAST_ENVI_SUCCESS_MESSAGE || DEFAULT_SUCCESS),
  };

  // if we failed, update the error with the reson too
  if (!res.succeeded) {
    res.error = `${res.reason || ''}\n\n${res.error || ''}`.trim();
  }

  // return and merge with most recent message from ENVI
  return { idlOutput, ...res };
}
