import { URI } from 'vscode-uri';

/**
 * Maps a path on disk to a VSCode URI
 */
export function URIFromFSPath(fsPath: string) {
  return URI.file(fsPath);
}
