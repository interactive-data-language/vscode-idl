import { CodeChecksum } from '@idl/parser';
import { GetFSPath } from '@idl/shared';
import { readFileSync } from 'fs';

import { DOCUMENT_MANAGER } from '../events/initialize-document-manager';
import { URIFromFSPath } from './uri-from-fspath';

/**
 * Last version of a file that we processed
 */
const CHECKSUM_CACHE: { [key: string]: string } = {};

/**
 * Given a URI for a file, does it match the latest cache and we
 * exclude from processing?
 *
 * Returns true if the cache is the same, otherwise the file has changed
 * and should be processed.
 */
export function CacheValid(uri: string) {
  /**
   * Flag if our cache is valid or not
   */
  let isValid = false;

  /**
   * Get document
   */
  const doc = DOCUMENT_MANAGER.get(uri);

  try {
    /**
     * Get checksum
     */
    const checksum =
      doc !== undefined
        ? CodeChecksum(doc.getText())
        : CodeChecksum(readFileSync(GetFSPath(uri), 'utf-8'));

    // see if we have tracked already or not
    if (uri in CHECKSUM_CACHE) {
      isValid = CHECKSUM_CACHE[uri] === checksum;
    }

    // always save latest checksum
    CHECKSUM_CACHE[uri] = checksum;
  } catch (err) {
    console.log(err);
  }

  return isValid;
}

/**
 * Given a file system path for a file, does it match the latest cache
 * and we exclude it from processing?
 */
export function CacheValidFSPath(fsPath: string) {
  return CacheValid(URIFromFSPath(fsPath).toString());
}
