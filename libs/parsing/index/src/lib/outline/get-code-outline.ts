import { CancellationToken } from '@idl/cancellation-tokens';
import { DocumentSymbol } from 'vscode-languageserver';

import {
  GetParsedPROCode,
  PENDING_PRO_CODE,
} from '../get-parsed/get-parsed-pro-code';
import { IDLIndex } from '../idl-index.class';

/**
 * Get the outline of our file nicely fro our cache or pending files
 * to reduce extra work
 */
export async function GetCodeOutline(
  index: IDLIndex,
  file: string,
  code: string | string[],
  token = new CancellationToken()
): Promise<DocumentSymbol[]> {
  switch (true) {
    /**
     * Check if it is pending
     */
    case file in PENDING_PRO_CODE:
      return (await PENDING_PRO_CODE[file].promise).outline;

    /**
     * Check if it is in our lookup
     */
    case index.tokensByFile.has(file):
      return index.tokensByFile.outline(file);

    /**
     * Parse to get the outline
     */
    default:
      return (await GetParsedPROCode(index, file, code, token)).outline;
  }
}
