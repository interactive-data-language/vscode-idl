import { GlobalTokens } from '@idl/types/core';
import {
  ChangeDetectionResponse,
  LoadGlobalResponse,
  LSP_WORKER_THREAD_MESSAGE_LOOKUP,
} from '@idl/workers/parsing';

import { IDLIndex } from '../idl-index.class';
import { GetChangedGlobals } from './get-changed-globals';

/**
 * Unpacks change detection or post processing results from our
 * worker threads
 *
 * Returns the global tokens that have changed and automatically synchronizes
 * any missing files.
 *
 * Updates our lookup with the new global tokens and synchronizes globals
 * with our worker threads
 */
export async function ProcessChangeDetectionResults(
  index: IDLIndex,
  changes: Promise<ChangeDetectionResponse>[]
) {
  /** Track changed global tokens */
  let changedGlobals: GlobalTokens = [];

  /** Track missing files */
  let missingFiles: string[] = [];

  /**
   * Track changed files
   */
  const changed: { [key: string]: GlobalTokens } = {};

  // save syntax problems for our file
  for (let i = 0; i < changes.length; i++) {
    // get response
    const res = await changes[i];

    // save global changes
    Object.assign(changed, res.globals);

    // update missing files
    missingFiles = missingFiles.concat(res.missing);

    // track syntax problems for each file
    const keys = Object.keys(res.problems);
    for (let z = 0; z < keys.length; z++) {
      index.trackSyntaxProblemsForFile(keys[z], res.problems[keys[z]]);
    }
  }

  /**
   * Get files that had global changes
   */
  const changedFiles = Object.keys(changed);

  // process again
  if (changedFiles.length > 0) {
    for (let i = 0; i < changedFiles.length; i++) {
      changedGlobals = changedGlobals.concat(
        GetChangedGlobals(
          index.globalIndex.globalTokensByFile[changedFiles[i]],
          changed[changedFiles[i]]
        )
      );

      // track in our process
      index.globalIndex.trackGlobalTokens(
        changed[changedFiles[i]],
        changedFiles[i]
      );
    }

    /**
     * Get the IDs for our workers
     */
    const ids = index.indexerPool.getIDs();

    /**
     * Messages for global token synchronization
     */
    const reSync: Promise<LoadGlobalResponse>[] = [];

    // send message to all other workers
    for (let j = 0; j < index.nWorkers; j++) {
      reSync.push(
        index.indexerPool.workerio.postAndReceiveMessage(
          ids[j],
          LSP_WORKER_THREAD_MESSAGE_LOOKUP.TRACK_GLOBAL,
          changed
        ).response
      );
    }

    // wait for sync
    await Promise.all(reSync);
  }

  /**
   * Check if we had any files that were deleted while we were trying to process
   */
  if (missingFiles.length > 0) {
    await index.removeWorkspaceFiles(missingFiles, false);
  }

  return { changedGlobals, missingFiles };
}
