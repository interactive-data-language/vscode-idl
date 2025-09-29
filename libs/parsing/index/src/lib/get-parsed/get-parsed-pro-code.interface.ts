import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed } from '@idl/types/syntax-tree';

/**
 * Data we track for pending PRO code
 */
export interface IGetParsedPROCodePending {
  /**
   * The checksum for the pending code
   */
  checksum: string;
  /**
   * Promise that resolves to the parsed file
   */
  promise: Promise<IParsed>;
  /**
   * Cancellation token that we can use
   */
  token: CancellationToken;
}
