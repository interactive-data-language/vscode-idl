import { CleanPath } from '@idl/shared/extension';
import { existsSync } from 'fs';
import { basename, dirname, join } from 'path';

/**
 * Walk folder tree assuming we are within a dist directory
 */
function GetRootFolder() {
  let previous: string | undefined;
  let current = __dirname;

  // walk up until we find "dist" or hit the filesystem root (dirname stops changing)
  while (current !== previous) {
    if (basename(current) === 'dist') {
      return dirname(current);
    }
    previous = current;
    current = dirname(current);
  }

  // never found a "dist" folder, so use what we have always had for previous logic
  return dirname(dirname(dirname(__dirname)));
}

/**
 * URI for the extension folder when we have a built package
 */
const DIST_URI = CleanPath(GetRootFolder());

/**
 * URI for the extension folder when running from tests using the current directory
 */
const TEST_URI = CleanPath(process.cwd());

/**
 * Returns the location of a file in the extension for use at
 * runtime, in tests, or when running inside Electron.
 *
 * Needed because we have different logic depending on if we are in tests,
 * runtime, or Electron.
 */
export function GetExtensionPath(file: string) {
  switch (true) {
    case existsSync(join(DIST_URI, file)):
      return join(DIST_URI, file);
    case existsSync(join(TEST_URI, file)):
      return join(TEST_URI, file);
    default:
      throw new Error(`Unable to locate file or folder: "${file}"`);
  }
}
