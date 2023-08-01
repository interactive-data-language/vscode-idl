import { deepEqual } from 'fast-equals';
import { NotebookDocument } from 'vscode-languageserver';

import { NOTEBOOK_MANAGER } from '../events/initialize-notebook-manager';

/**
 * Last version of notebook file
 */
const VERSION_CACHE: { [key: string]: number[] } = {};

/**
 * Given a notebook document, does it match the latest version and we
 * exclude from processing?
 *
 * Compared to text documents, we use the versions from code cells which
 * dont care about outputs
 *
 * Returns true if the cache is the same, otherwise the file has changed
 * and should be processed.
 */
export function NotebookCacheValid(notebook: NotebookDocument) {
  /**
   * Flag if our cache is valid or not
   */
  let isValid = false;

  /**
   * Get the versions of all cells
   *
   * If we change cell order, we need to re-parse
   */
  const cellVersions = notebook.cells
    // .filter((cell) => cell.kind === NotebookCellKind.Code)
    .map(
      (cell) =>
        NOTEBOOK_MANAGER.cellTextDocuments.get(cell.document)?.version || -1
    );

  // check if we have tracked already
  if (notebook.uri in VERSION_CACHE) {
    isValid = deepEqual(VERSION_CACHE[notebook.uri], cellVersions);
  }

  // save latest version
  VERSION_CACHE[notebook.uri] = cellVersions;

  // return flag
  return isValid;
}
