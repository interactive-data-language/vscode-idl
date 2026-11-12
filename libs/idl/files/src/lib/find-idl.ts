import type { CompareOperator } from 'compare-versions';
import * as os from 'os';
import * as path from 'path';

import { FindMatchingIDLInstalls } from './find-matching-idl-installs';

/**
 * Checks expected locations for IDL 8.4+ and returns
 * the folder if found.
 *
 * The folder is where the IDL executable lives (i.e. bin directory)
 *
 * @param version IDL version to compare against, as "idl92" or "9.2".
 *   If not provided, the newest install is returned.
 * @param operator How each install is compared to the version. For example,
 *   `>=` returns the newest install that is the same as or newer than `version`.
 */
export function FindIDL(
  version?: string,
  operator: CompareOperator = '=',
): string | undefined {
  // check default locations and, on Windows, the registry
  let idlDir: string | undefined = FindMatchingIDLInstalls(
    version,
    operator,
  )[0];

  // check the environment variable if we didnt find anything
  if (idlDir === undefined) {
    if ('IDL_DIR' in process.env) {
      // get the variable
      idlDir = process.env.IDL_DIR;

      // check if we have anything to add to the path
      let add = '';
      switch (os.platform()) {
        case 'darwin':
          add = 'bin';
          break;
        case 'linux':
          add = 'bin';
          break;
        default:
        // do nothing
      }

      // append the bin folder - just default to 64 bit for now
      if (add) {
        idlDir += `${path.sep}${add}`;
      }
    }
  }

  return idlDir;
}
