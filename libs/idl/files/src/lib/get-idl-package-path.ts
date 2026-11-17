import { existsSync } from 'fs';

import { IDL_PACKAGE_DIR } from './dot-idl-folder.interface';

/**
 * Returns the folder for IDL's package path
 *
 * Checks for the environment variable override or returns the
 * default user location
 */
export function GetIDLPackagePath() {
  // check if we have a path in the environment
  const envPath = process.env['IDL_PACKAGE_PATH'];
  if (envPath && existsSync(envPath)) {
    return envPath;
  }

  // return user folder
  return IDL_PACKAGE_DIR;
}
