import { NotebookDocument } from 'vscode-languageserver';

/**
 * Last version of notebook file
 */
const VERSION_CACHE: { [key: string]: number } = {};

/**
 * Given a notebook document, does it match the latest version and we
 * exclude from processing?
 *
 * Returns true if the cache is the same, otherwise the file has changed
 * and should be processed.
 */
export function NotebookCacheValid(notebook: NotebookDocument) {
  /**
   * Flag if our cache is valid or not
   */
  let isValid = false;

  // check if we have tracked already
  if (notebook.uri in VERSION_CACHE) {
    isValid = VERSION_CACHE[notebook.uri] === notebook.version;
  }

  // save latest version
  VERSION_CACHE[notebook.uri] = notebook.version;

  // return flag
  return isValid;
}
