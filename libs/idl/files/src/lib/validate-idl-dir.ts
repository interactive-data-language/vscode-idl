import { existsSync } from 'fs';
import { platform } from 'os';
import { join } from 'path';

/**
 * Validates the IDL directory and returns true/false if present
 * and we find the IDL executable located within
 *
 * Resolve edge case where uninstall doesn't delete folders
 */
export function ValidateIDLDir(dir: string | undefined): boolean {
  // no value
  if (!dir) {
    return false;
  }

  // no directory
  if (!existsSync(dir)) {
    return false;
  }

  // validate idl executable
  const idlExe = join(dir, platform() === 'win32' ? 'idl.exe' : 'idl');

  // make sure exists
  return existsSync(idlExe);
}
