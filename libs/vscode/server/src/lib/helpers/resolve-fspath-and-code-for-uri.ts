import { GetFSPath } from '@idl/idl/files';
import { IDLFileHelper } from '@idl/shared/extension';
import { URI } from 'vscode-uri';

import { NOTEBOOK_MANAGER } from '../events/initialize-notebook-manager';
import { GetFileStrings } from './get-file-strings';
import { IResolvedFSPathAndCodeForURI } from './resolve-fspath-and-code-for-uri.interface';

/**
 * Given a URI, resolves the appropriate file system path and retrieves
 * the code so that we have a centralized location to create and re-use
 * this logic which accounts for notebooks and PRO code.
 *
 * Resolves symbolic links to get true paths on disk, so use the "fsPath" that
 * gets returned here for the tru paths on disk.
 */
export async function ResolveFSPathAndCodeForURI(
  url: string
): Promise<IResolvedFSPathAndCodeForURI | undefined> {
  /**
   * parse the URI for the document
   */
  const parsed = URI.parse(url);

  /**
   * Get official FSPath for root file
   */
  const fsPath = GetFSPath(url);

  /**
   * Check if PRO code
   */
  if (parsed.scheme === 'file') {
    return {
      type: 'pro',
      uri: url,
      fsPath,
      code: await GetFileStrings(url, fsPath),
    };
  }

  /**
   * Validate notebook
   */
  if (!IDLFileHelper.isIDLNotebookFile(fsPath)) {
    return undefined;
  }

  /**
   * get notebook document
   */
  const nb = NOTEBOOK_MANAGER.getNotebookDocument(URI.file(fsPath).toString());

  // return if no matching notebook
  if (nb === undefined) {
    return undefined;
  }

  // get the cell index
  const idx = nb.cells.findIndex((cell) => cell.document === url);

  // get cell document
  const cellDoc = NOTEBOOK_MANAGER.getCellTextDocument(nb.cells[idx]);

  // return our information
  return {
    type: 'notebook',
    uri: url,
    fsPath: `${fsPath}#${idx}`,
    code: cellDoc.getText(),
    doc: cellDoc,
  };
}
