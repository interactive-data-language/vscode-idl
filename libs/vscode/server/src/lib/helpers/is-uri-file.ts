import { URI } from 'vscode-uri';

/**
 * Parses a URI from VSCode and determines if we have a file scheme or not
 */
export function IsURIFile(uri: string) {
  return URI.parse(uri).scheme === 'file';
}
