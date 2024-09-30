import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens } from '@idl/types/core';

import { IDLIndex } from '../idl-index.class';
import { IChangeDetection } from './change-detection.interface';

/**
 * Based on an array of global tokens, checks all index files in they
 * need to have post-processing run again
 *
 * Returns the files that we post-processed
 */
export async function ChangeDetection(
  index: IDLIndex,
  token: CancellationToken,
  changed: GlobalTokens
): Promise<IChangeDetection> {
  /** Files that we will post-process again */
  const postProcessThese: string[] = [];

  /** Get the current indexed files */
  const files = index.parsedCache.allFiles();

  // process each file
  for (let z = 0; z < files.length; z++) {
    // get our parsed file
    const uses = index.parsedCache.uses(files[z]);

    // check for a match
    for (let i = 0; i < changed.length; i++) {
      const globalI = changed[i];
      if (globalI.name in uses[globalI.type]) {
        postProcessThese.push(files[z]);
        break;
      }
    }
  }

  /**
   * Post-process these files again
   */
  const post = await index.postProcessProFiles(postProcessThese, token, false);

  /** Get missing files */
  const missing = post.missing;

  // if we have missing files, then remove them from "changed"
  if (missing.length > 0) {
    for (let i = 0; i < missing.length; i++) {
      const idx = postProcessThese.indexOf(missing[i]);
      if (idx !== -1) {
        postProcessThese.splice(idx, 1);
      }
    }
  }

  return {
    changed: postProcessThese,
    globals: post.globals,
    missing: post.missing,
  };
}
