/**
 * Result of starting IDL, returned by `IIDLMCPExecutionBackend.start()`
 */
export type IIDLStartResult = {
  /** Reason we did not start */
  reason?: string;
  /** If we started or not */
  started: boolean;
};
