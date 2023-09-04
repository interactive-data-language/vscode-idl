import { IDLNotebookDocument } from '@idl/notebooks/shared';

import { IGetParsedNotebookPending } from './get-parsed-notebook.interface';
import { IDLIndex } from './idl-index.class';

/**
 * Track the pending files
 */
const PENDING_NOTEBOOK: { [key: string]: IGetParsedNotebookPending } = {};

/**
 * Handles getting a parsed notebook within a worker thread
 */
export async function GetParsedNotebook(
  index: IDLIndex,
  file: string,
  notebook: IDLNotebookDocument
) {
  // get the total version for notebook cells
}
