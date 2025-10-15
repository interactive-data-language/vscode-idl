import { GetFSPath } from '@idl/idl/files';
import { WorkspaceFolder } from 'vscode-languageserver/node';

/**
 * Maps the URI for a workspace folder to the path on disk
 *
 * Resolves symbolic links to get true paths on disk.
 */
export function GetWorkspaceFSPath(folder: WorkspaceFolder) {
  return GetFSPath(folder.uri);
}
