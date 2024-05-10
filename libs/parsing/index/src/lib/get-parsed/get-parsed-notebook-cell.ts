import { CancellationToken } from '@idl/cancellation-tokens';
import { CodeChecksum, Parser } from '@idl/parser';
import { IParsed } from '@idl/parsing/syntax-tree';

import { ResolveNotebookVariablesFromProcedures } from '../helpers/resolve-notebook-variables-from-procedures';
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

  // parse the file
  const parsed = Parser(code, token, { isNotebook: true });

  // differentiate between vars and pros
  ResolveNotebookVariablesFromProcedures(parsed);

  // manually parse the cell
  return parsed;
}
