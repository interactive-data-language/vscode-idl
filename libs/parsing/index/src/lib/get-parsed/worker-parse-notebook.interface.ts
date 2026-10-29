import type { CancellationToken } from '@idl/cancellation-tokens';
import type { ParseNotebookResponse } from '@idl/workers/parsing';

/**
 * Data we track for pending PRO code
 */
export interface IParsedNotebookPending {
  /**
   * The checksums for the code cells
   */
  checksums: string[];
  /**
   * Promise that resolves to the parsed notebook
   */
  promise: Promise<ParseNotebookResponse>;
  /**
   * Cancellation token that we can use
   */
  token: CancellationToken;
}
