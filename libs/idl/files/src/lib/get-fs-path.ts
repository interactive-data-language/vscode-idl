import { URI } from 'vscode-uri';

import { CleanPath } from './clean-path';
import { GetCanonicalPath } from './get-canonical-path';

/**
 * Parses a VSCode URI and returns the fully-qualified filepath on disk.
 *
 * Resolves symbolic links to get true paths on disk.
 */
export function GetFSPath(uri: string) {
  /**
   * Get cleaned path for fil eon disk
   */
  const cleaned = CleanPath(URI.parse(uri).fsPath);

  // return canonical path for file on disk
  return GetCanonicalPath(cleaned);
}
