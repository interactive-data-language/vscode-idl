import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { IDL_DIRS } from './idl-dirs.interface';

/**
 * Checks expected locations for IDL 8.4+ and returns
 * the folder if found.
 *
 * The folder is where the IDL executable lives (i.e. bin directory)
 */
export function FindIDL(): string | undefined {
  // detect IDL's installation directory
  let idlDir: string;

  // check default locations
  const testDirs = IDL_DIRS[os.platform()];
  for (let i = 0; i < testDirs.length; i++) {
    const dir = testDirs[i];
    if (fs.existsSync(dir)) {
      idlDir = dir;
      break;
    }
  }

  // check the environment variable if we didnt find anything
  if (idlDir === undefined) {
    if ('IDL_DIR' in process.env) {
      // get the variable
      idlDir = process.env.IDL_DIR;

      // check if we have anything to add to the path
      let add = '';
      switch (os.platform()) {
        case 'linux':
          add = 'bin';
          break;
        case 'darwin':
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
