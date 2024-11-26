import { realpathSync } from 'fs';
import { URI } from 'vscode-uri';

import { CleanPath } from './clean-path';

/**
 * Parses a VSCode URI and returns the fully-qualified filepath on disk.
 *
 * Resolves symbolic links to get true paths on disk.
 */
export function GetFSPath(uri: string) {
  return realpathSync(CleanPath(URI.parse(uri).fsPath));
}
