import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens } from '@idl/data-types/core';
import { IDL_WORKER_THREAD_CONSOLE } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { existsSync } from 'fs';

import { IDLIndex } from '../idl-index.class';
import { IDL_INDEX_OPTIONS } from '../idl-index.interface';
import { PostProcessParsed } from '../post-process/post-process-parsed';
import { IChangeDetection } from './change-detection.interface';

/**
 * Track the files that we are processing for change detection to make
 * sure that we only do this once
 */
const IS_CHANGING: { [key: string]: undefined } = {};

/**
 * Based on an array of global tokens, checks all index files in they
 * need to have post-processing run again
 *
 * Returns the files that we post-processed
 */
export function ChangeDetection(
  index: IDLIndex,
  token: CancellationToken,
  changed: GlobalTokens
): IChangeDetection {
  /** Files that we will post-process again */
  const postProcessThese: string[] = [];

  /** Missing files */
  const missingFiles: string[] = [];

  /** Get the current indexed files */
  const files = index.tokensByFile.allFiles();

  // process each file
  for (let z = 0; z < files.length; z++) {
    // skip if we have already processed
    if (files[z] in IS_CHANGING) {
      continue;
    }

    // track that we are doing change detection on this
    IS_CHANGING[files[z]] = undefined;

    // get our parsed file
    const uses = index.tokensByFile.uses(files[z]);

    // check for a match
    for (let i = 0; i < changed.length; i++) {
      const globalI = changed[i];
      if (globalI.name in uses[globalI.type]) {
        postProcessThese.push(files[z]);
        break;
      }
    }
  }

  // process all of our files again
  for (let z = 0; z < postProcessThese.length; z++) {
    if (global.gc) {
      if (z % IDL_INDEX_OPTIONS.GC_FREQUENCY === 0) {
        global.gc();
      }
    }

    try {
      PostProcessParsed(
        index,
        postProcessThese[z],
        index.tokensByFile.get(postProcessThese[z]),
        token
      );
    } catch (err) {
      // check if we have a "false" error because a file was deleted
      if (!existsSync(files[z]) && !files[z].includes('#')) {
        missingFiles.push(files[z]);
        index.log.log({
          log: IDL_WORKER_THREAD_CONSOLE,
          type: 'warn',
          content: [
            `File was deleted, but we were not alerted before performing change detection`,
            files[z],
          ],
        });
      } else {
        index.log.log({
          log: IDL_WORKER_THREAD_CONSOLE,
          type: 'error',
          content: [
            `Error while performing change detection (likely from worker thread):`,
            err,
          ],
          alert: IDL_TRANSLATION.lsp.index.failedChangeDetection,
        });
      }
    }
  }

  // if we have missing files, then remove them from "changed"
  if (missingFiles.length > 0) {
    for (let i = 0; i < missingFiles.length; i++) {
      const idx = postProcessThese.indexOf(missingFiles[i]);
      if (idx !== -1) {
        postProcessThese.splice(idx, 1);
      }
    }
  }

  // remove files that we are doing change detection on
  for (let i = 0; i < postProcessThese.length; i++) {
    delete IS_CHANGING[postProcessThese[i]];
  }

  /**
   * TODO: can we build a relational tree for recursion to update return types from functions without docs?
   *
   * TLDR: we have cascading change detection effects if we auto-determine the return type of the function. basically
   * turns into a game of dominos, when function 1 changes types, but is called in function 2. Function 2's return is
   * that of function 1, and function 2 is used in 13 more places.
   */

  // return our changed things
  return { changed: postProcessThese, missing: missingFiles };
}
