import { existsSync, realpathSync } from 'fs';

/**
 * Gets the canonical path for a file
 *
 * Handles special logic with "realpathSync" that needs to
 * have a file that exists on disk.
 */
export function GetCanonicalPath(fsPath: string) {
  return existsSync(fsPath) ? realpathSync(fsPath) : fsPath;
}
