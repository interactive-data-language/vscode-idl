import { CancellationToken } from '@idl/cancellation-tokens';
import { IDLNotebookDocument, IParsedIDLNotebook } from '@idl/notebooks/shared';
import { CodeChecksum } from '@idl/parser';
import { deepEqual } from 'fast-equals';
import { NotebookCellKind } from 'vscode-languageserver';

import { IDLIndex } from '../idl-index.class';
import { IGetParsedNotebookPending } from './get-parsed-notebook.interface';

/**
 * Track the pending files
 */
export const PENDING_NOTEBOOK: { [key: string]: IGetParsedNotebookPending } =
  {};

/**
 * Handles getting a parsed notebook from the IDL index
 */
export async function GetParsedNotebook(
  index: IDLIndex,
  file: string,
  notebook: IDLNotebookDocument,
  token: CancellationToken
): Promise<IParsedIDLNotebook> {
  // track all checksums
  const checksums: string[] = [];

  // get checksums
  for (let i = 0; i < notebook.cells.length; i++) {
    // skip if not code
    if (notebook.cells[i].kind !== NotebookCellKind.Code) {
      continue;
    }

    // track checksums
    checksums.push(CodeChecksum(notebook.cells[i].text));
  }

  // determine how to proceed
  switch (true) {
    case file in PENDING_NOTEBOOK: {
      /**
       * Get pending file
       */
      const pending = PENDING_NOTEBOOK[file];

      // check if our checksums are valid
      if (deepEqual(pending.checksums, checksums)) {
        return pending.promise;
      } else {
        // different checksums, so mark as cancelled
        pending.token.cancel();
      }
      break;
    }
    default:
      break;
  }

  // track pending notebook parsing
  const newPending: IGetParsedNotebookPending = {
    checksums,
    token,
    promise: index.indexIDLNotebook(file, notebook, token),
  };

  // mark as pending
  PENDING_NOTEBOOK[file] = newPending;

  // wait for finish
  const res = await newPending.promise;

  // clean up pending
  delete PENDING_NOTEBOOK[file];

  // return result
  return res;
}
