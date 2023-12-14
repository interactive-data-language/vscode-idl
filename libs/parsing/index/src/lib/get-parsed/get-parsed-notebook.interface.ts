import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsedIDLNotebook } from '@idl/notebooks/shared';

/**
 * Data we track for pending PRO code
 */
export interface IGetParsedNotebookPending {
  /**
   * Promise that resolves to the parsed notebook
   */
  promise: Promise<IParsedIDLNotebook>;
  /**
   * Cancellation token that we can use
   */
  token: CancellationToken;
  /**
   * The checksums for the code cells
   */
  checksums: string[];
}
