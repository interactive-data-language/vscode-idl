import { GetFSPath } from '@idl/shared';
import { WorkspaceFolder } from 'vscode-languageserver/node';

/**
 * Maps the URI for a workspace folder to the path on disk
 */
export function GetWorkspaceFSPath(folder: WorkspaceFolder) {
  return GetFSPath(folder.uri);
}
