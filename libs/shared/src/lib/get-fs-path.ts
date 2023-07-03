import { URI } from 'vscode-uri';

import { CleanPath } from './clean-path';

/**
 * Parses a VSCode URI and returns the fully-qualified filepath on disk.
 */
export function GetFSPath(uri: string) {
  return CleanPath(URI.parse(uri).fsPath);
}
