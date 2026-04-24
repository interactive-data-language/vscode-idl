import { existsSync } from 'fs';

import { IDL_PACKAGE_DIR } from './dot-idl-folder.interface';
import { IFolderRecursion } from './find-files.interface';
import { GetExtensionPath } from './get-extension-path';
import { LoadENVIPaths } from './load-envi-paths';

/**
 * Track additional search paths from:
 *
 * 1. The extension
 * 2. User IDL packages folder
 * 3. ENVI's package preference location (if ENVI installed, from ENVI preference file)
 */
export function LoadIDLSearchPaths(
  paths: IFolderRecursion,
  idlBin?: string,
): boolean {
  // add in our IDL folder
  paths[GetExtensionPath('idl/vscode/notebooks')] = true;

  // check for .idl package folder and auto-add if it exists
  if (existsSync(IDL_PACKAGE_DIR)) {
    paths[IDL_PACKAGE_DIR] = true;
  }

  // return if we don't have a folder
  if (!idlBin) {
    return false;
  }

  /** Load folders where custom content for ENVI lives */
  const enviPaths = LoadENVIPaths(idlBin);

  // add all paths to the index
  for (let i = 0; i < enviPaths.length; i++) {
    paths[enviPaths[i]] = true;
  }

  // return if we found ENVI paths
  return enviPaths.length > 0;
}
