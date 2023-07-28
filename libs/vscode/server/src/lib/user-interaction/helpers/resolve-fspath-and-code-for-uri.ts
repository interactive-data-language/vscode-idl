import { CleanPath } from '@idl/shared';
import { URI } from 'vscode-uri';

import { IDL_INDEX } from '../../file-management/initialize-document-manager';
import { NOTEBOOK_MANAGER } from '../../file-management/initialize-notebook-manager';
import { GetFileStrings } from '../../helpers/get-file-strings';
import { IResolvedFSPathAndCodeForURI } from './resolve-fspath-and-code-for-uri.interface';

/**
 * Given a URI, resolves the appropriate file system path and retrieves
 * the code so that we have a centralized location to create and re-use
 * this logic which accounts for notebooks and PRO code.
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
  const fsPath = CleanPath(parsed.fsPath);

  /**
   * Check if PRO code
   */
  if (parsed.scheme === 'file') {
    // do nothing
    if (!IDL_INDEX.isPROCode(fsPath)) {
      return undefined;
    }

    // return our information
    return {
      isNotebook: false,
      uri: url,
      fsPath,
      code: await GetFileStrings(fsPath),
    };
  }

  /**
   * Validate notebook
   */
  if (!IDL_INDEX.isIDLNotebookFile(fsPath)) {
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
    isNotebook: true,
    uri: url,
    fsPath: `${fsPath}#${idx}`,
    code: cellDoc.getText(),
    doc: cellDoc,
  };
}
