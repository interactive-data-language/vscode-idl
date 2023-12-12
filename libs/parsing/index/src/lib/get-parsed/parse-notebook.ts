import { IDLNotebookDocument } from '@idl/notebooks/shared';
import { CodeChecksum } from '@idl/parser';
import {
  LSP_WORKER_THREAD_MESSAGE_LOOKUP,
  ParseNotebookResponse,
} from '@idl/workers/parsing';
import { deepEqual } from 'fast-equals';
import { NotebookCellKind } from 'vscode-languageserver';

import { IDLIndex } from '../idl-index.class';
import { IParsedNotebookPending } from './parse-notebook.interface';

/**
 * Track the pending files
 */
const PENDING_NOTEBOOK: { [key: string]: IParsedNotebookPending } = {};

/**
 * Handles getting a parsed notebook from the IDL index
 */
export async function ParseNotebook(
  index: IDLIndex,
  file: string,
  notebook: IDLNotebookDocument
): Promise<ParseNotebookResponse> {
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

  /**
   * Get ID of our worker
   */
  const id = index.getWorkerID(file);

  // parse our notebook
  const resp = index.indexerPool.workerio.postAndReceiveMessage(
    id,
    LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_NOTEBOOK,
    { file, notebook }
  );

  // mark as pending
  PENDING_NOTEBOOK[file] = {
    checksums,
    token: resp.token,
    promise: resp.response,
  };

  // wait for finish
  const res = await resp.response;

  // clean up pending
  delete PENDING_NOTEBOOK[file];

  // return result
  return res;
}
