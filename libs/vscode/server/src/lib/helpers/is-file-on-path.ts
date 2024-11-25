import { IFolderRecursion } from '@idl/parsing/index';
import { dirname } from 'path';

/**
 * Determines if a file in on a specified path
 *
 * Handles the "+" logic for recursive or single directories
 */
export function IsFileOnPath(file: string, path: IFolderRecursion) {
  /** Get directory */
  const dir = dirname(file);

  /** Get paths for folders */
  const folders = Object.keys(path);

  // compare
  for (let z = 0; z < folders.length; z++) {
    // is it a recursive folder?
    if (path[folders[z]]) {
      // if recursive, just check if our path starts with recursive directory
      if (file.startsWith(folders[z])) {
        return true;
      }
    } else {
      // check if we are in a non-recursive folder
      if (folders[z] === dir) {
        return true;
      }
    }
  }

  return false;
}
