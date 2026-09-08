import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Resolves the fully-qualified filepaths for images because the links
 * are not always right
 */
export function ResolveLinks(folder: string, relative: string) {
  // check if we can fix a URL
  if (relative.startsWith('../../Resources')) {
    // we need to go up a folder
    const newUrl = `../${relative}`;

    // get absolute path
    const newFile = resolve(folder, newUrl);

    // check if it exists
    if (existsSync(newFile)) {
      return newUrl;
    }
  }

  // return resolve
  return resolve(folder, relative);
}
