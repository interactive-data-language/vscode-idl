import { existsSync } from 'fs';
import { dirname, join } from 'path';

import { CleanPath } from './clean-path';

/**
 * URI for the extension folder when we have a built package
 */
const DIST_URI = CleanPath(dirname(dirname(dirname(__dirname))));

/**
 * URI for the extension folder when running from tests using the current directory
 */
const TEST_URI = CleanPath(process.cwd());

/**
 * Returns the expected path for a runtime file
 */
export function GetRuntimePath(file: string) {
  return join(DIST_URI, file);
}

/**
 * Returns the location of a file in the extension for use at
 * runtime or in tests.
 *
 * Needed because we have different logic depending on if we are in tests
 * or runtime.
 */
export function GetExtensionPath(file: string) {
  switch (true) {
    case existsSync(join(DIST_URI, file)):
      return join(DIST_URI, file);
    case existsSync(join(TEST_URI, file)):
      return join(TEST_URI, file);
    default:
      throw new Error(`Unable to locate file: "${file}"`);
  }
}
