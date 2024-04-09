import { GetFSPath } from '@idl/shared';
import { existsSync, readFileSync } from 'fs';

import { DOCUMENT_MANAGER } from '../events/initialize-document-manager';
import { URIFromFSPath } from './uri-from-fspath';

/**
 * Gets the text for a given file. If the file is managed by our document manager, then we
 * assume it is a file on disk.
 *
 * This routine is needed because, when we have changes, the file may nopt always be saved to disk
 * and could be un-saved changes in the editor.
 */
export async function GetFileStrings(uri: string): Promise<string> {
  // init return value
  let strings = '';

  // check if we are managing our document or need to read it
  const doc = DOCUMENT_MANAGER.get(uri);
  if (doc !== undefined) {
    strings = doc.getText();
  } else {
    /** Get fs path */
    const fsPath = GetFSPath(uri);

    /**
     * Silently ignore when the file is deleted which is handled
     * elsewhere
     */
    if (existsSync(fsPath)) {
      strings = readFileSync(GetFSPath(fsPath), 'utf8');
    }
  }

  return strings;
}

/**
 * Wrapper that gets file strings from a filesystem path
 */
export async function GetFileStringsFromFSPath(fsPath: string) {
  return GetFileStrings(URIFromFSPath(fsPath).toString());
}
