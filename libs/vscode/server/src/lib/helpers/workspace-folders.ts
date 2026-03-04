import { CleanPath } from '@idl/shared/extension';
import { copy } from 'fast-copy';

/**
 * Track workspace folders
 */
let FOLDERS: string[] = [];

/**
 * Updates our list of workspace folders
 */
export function UpdateWorkspaceFolders(folders: string[]) {
  // clean path makes true windows path (case-insensitive sometimes)
  FOLDERS = folders.map((item) => CleanPath(item));
}

/**
 * Get the list of workspace folders
 */
export function GetWorkspaceFolders() {
  return copy(FOLDERS);
}
