import { CancellationToken } from '@idl/cancellation-tokens';
import { CodeChecksum, Parser } from '@idl/parser';
import { IParsed } from '@idl/parsing/syntax-tree';

import { IDLIndex } from '../idl-index.class';
import { PENDING_NOTEBOOK } from './get-parsed-notebook';

/**
 * Handles getting a parsed notebook from the IDL index
 */
export async function GetParsedNotebookCell(
  index: IDLIndex,
  cellFile: string,
  code: string | string[],
  token: CancellationToken
): Promise<IParsed> {
  /** Get file for notebook */
  const nbFile = cellFile.split('#')[0];

  /** Check for code checksum */
  const checksum = CodeChecksum(code);

  // check if it exists
  if (nbFile in PENDING_NOTEBOOK) {
    // get answer
    const nb = await PENDING_NOTEBOOK[nbFile].promise;

    // verify checksum
    if (nb[cellFile]?.checksum === checksum) {
      return nb[cellFile];
    }
  }

  // check if we have already parsed the file
  if (index.tokensByFile.has(cellFile)) {
    if (index.tokensByFile.checksumMatches(cellFile, checksum)) {
      return index.tokensByFile.get(cellFile);
    }
  }

  // TODO: add in post-processing

  // manually parse the cell
  return Parser(code, token, { isNotebook: true });
}
