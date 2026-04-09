import {
  GetExtensionPath,
  IDL_PACKAGE_DIR,
  IFolderRecursion,
  LoadENVIPaths,
} from '@idl/idl/files';
import { existsSync } from 'fs';

/**
 * Track additional search paths from:
 *
 * 1. The extension
 * 2. User IDL packages folder
 * 3. ENVI's package preference location (if ENVI installed, from ENVI preference file)
 */
export function AddAdditionalSearchPaths(
  paths: IFolderRecursion,
  idlBin: string,
) {
  // add in our IDL folder
  paths[GetExtensionPath('idl/vscode/notebooks')] = true;

  // check for .idl package folder and auto-add if it exists
  if (existsSync(IDL_PACKAGE_DIR)) {
    paths[IDL_PACKAGE_DIR] = true;
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
