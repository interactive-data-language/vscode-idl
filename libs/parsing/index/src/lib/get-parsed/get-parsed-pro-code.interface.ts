import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed } from '@idl/parsing/syntax-tree';

/**
 * Data we track for pending PRO code
 */
export interface IGetParsedPROCodePending {
  /**
   * Promise that resolves to the parsed file
   */
  promise: Promise<IParsed>;
  /**
   * Cancellation token that we can use
   */
  token: CancellationToken;
  /**
   * The checksum for the pending code
   */
  checksum: string;
}
