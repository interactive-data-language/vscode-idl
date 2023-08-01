import { NOTEBOOK_MANAGER } from '../events/initialize-notebook-manager';
import { URIFromFSPath } from './uri-from-fspath';

/**
 * Maps a file back to a URI and handles the logic of checking for notebooks
 */
export function URIFromIDLIndexFile(file: string) {
  /**
   * Split and see if we have cells
   */
  const split = file.split('#');

  /**
   * Get URI for true file
   */
  const uri = URIFromFSPath(split[0]).toString();

  // handle case of PRO files
  if (split.length === 1) {
    return uri;
  }

  // track down notebook cell
  const nb = NOTEBOOK_MANAGER.getNotebookDocument(uri);

  // validate notebook
  if (nb === undefined) {
    return uri;
  }

  // get cell
  const cell = nb.cells[+split[1]];

  // validate cell
  if (cell === undefined) {
    return uri;
  }

  // return URI for cell
  return cell.document;
}
