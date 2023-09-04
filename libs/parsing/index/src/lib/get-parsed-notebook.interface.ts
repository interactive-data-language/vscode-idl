import { CancellationToken } from '@idl/cancellation-tokens';
import { ParseNotebookResponse } from '@idl/workers/parsing';

/**
 * Data we track for pending PRO code
 */
export interface IGetParsedNotebookPending {
  /**
   * Promise that resolves to the parsed notebook
   */
  promise: Promise<ParseNotebookResponse>;
  /**
   * Cancellation token that we can use
   */
  token: CancellationToken;
  /**
   * The checksum for the pending code
   */
  version: number;
}
