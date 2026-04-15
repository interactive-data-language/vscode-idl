import { IDLEvaluateOptions } from '@idl/types/idl/idl-process';

/**
 * Options for creating an IDLMCPExecutionManager
 */
export interface IDLMCPExecutionManagerOptions {
  /**
   * Callback invoked when IDL Machine requests a line of user input (readIOLine).
   *
   * If not provided, an empty string is returned to IDL automatically.
   */
  onReadIOLine?: (prompt: string) => Promise<string>;
}

/**
 * Default options to use when evaluating IDL code in an MCP session
 */
export const DEFAULT_MCP_EVALUATE_OPTIONS: IDLEvaluateOptions = {
  echo: false,
  idlInfo: false,
  cut: false,
  silent: false,
};
