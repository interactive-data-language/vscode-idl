import { ALL_FILES_GLOB_PATTERN } from '@idl/shared/extension';
import { glob } from 'fast-glob';
import { existsSync, realpathSync } from 'fs';
import { join } from 'path';

import { IFolderRecursion } from './find-files.interface';

/**
 * Searches for files of a given pattern
 *
 * Handles recursion like IDL
 */
export async function FindFiles(
  folder: string | string[] | IFolderRecursion,
  pattern = ALL_FILES_GLOB_PATTERN
): Promise<string[]> {
  // init files that we find
  const files = new Set<string>();

  // init folders
  let folders: string[] = [];
  let recursion: boolean[] = [];

  // handle our input type
  switch (true) {
    case typeof folder === 'string':
      folders.push(folder as string);
      recursion.push(true);
      break;
    case Array.isArray(folder):
      folders = folder as string[];
      recursion = new Array(folders.length).fill(true);
      break;
    default:
      folders = Object.keys(folder as IFolderRecursion);
      recursion = Object.values(folder as IFolderRecursion);
      break;
  }

  // process all of our folder
  for (let i = 0; i < folders.length; i++) {
    // skip folders if they dont exist
    if (!existsSync(folders[i])) {
      continue;
    }

    // find the files in our folder
    const inFolder = (
      await glob(pattern, {
        cwd: folders[i],
        dot: true,
        deep: recursion[i] ? 100000000 : 1,
      })
    )
      .map((file) => join(folders[i], file))
      .map((file) => realpathSync(file));

    // add to our set
    for (let j = 0; j < inFolder.length; j++) {
      files.add(inFolder[j]);
    }
  }

  /**
   * Get unique files from our set
   */
  const uniqFiles = Array.from(files);

  // get files
  return uniqFiles;
}
