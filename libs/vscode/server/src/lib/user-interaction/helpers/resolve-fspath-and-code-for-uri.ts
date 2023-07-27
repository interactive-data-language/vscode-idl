import { GetFSPath } from '@idl/shared';

import { IDL_INDEX } from '../../file-management/initialize-document-manager';
import { NOTEBOOK_MANAGER } from '../../file-management/initialize-notebook-manager';
import { GetFileStrings } from '../../helpers/get-file-strings';

/**
 * Given a URI, resolves the appropriate file system path and retrieves
 * the code so that we have a centralized location to create and re-use
 * this logic which accounts for notebooks and PRO code.
 */
export async function ResolveFSPathAndCodeForURI(
  uri: string
): Promise<{ fsPath: string; isNotebook: boolean; code: string } | undefined> {
  /**
   * Split on hashtag in case we have a notebook coming through
   */
  const split = uri.split('#');

  /**
   * Get official FSPath for root file
   */
  const fsPath = GetFSPath(split[0]);

  /**
   * Check if PRO code
   */
  if (split.length === 1) {
    // do nothing
    if (!IDL_INDEX.isPROCode(fsPath)) {
      return undefined;
    }

    // return our information
    return {
      isNotebook: false,
      fsPath,
      code: await GetFileStrings(uri),
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
  const nb = NOTEBOOK_MANAGER.getNotebookDocument(split[0]);

  // return if no matching notebook
  if (nb === undefined) {
    return undefined;
  }

  // return our information
  return {
    isNotebook: true,
    fsPath: `${fsPath}#${split[1]}`,
    code: NOTEBOOK_MANAGER.getCellTextDocument(nb.cells[+split[1]]).getText(),
  };
}
