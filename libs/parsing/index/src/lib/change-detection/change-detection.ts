import { CancellationToken } from '@idl/cancellation-tokens';
import { IDL_LSP_LOG } from '@idl/logger';
import { GlobalTokens } from '@idl/types/core';
import {
  ChangeDetectionResponse,
  LSP_WORKER_THREAD_MESSAGE_LOOKUP,
} from '@idl/workers/parsing';
import { deepEqual } from 'fast-equals';
import { performance } from 'perf_hooks';

import { IDLIndex } from '../idl-index.class';
import {
  CHANGE_DETECTION_MAX_DEPTH,
  IChangeDetection,
} from './change-detection.interface';
import { GetChangedGlobals } from './get-changed-globals';
import { GetSortedGlobals } from './get-sorted-globals';
import { ProcessChangeDetectionResults } from './process-change-detection-results';

/**
 * Based on an array of global tokens, checks all index files in they
 * need to have post-processing run again
 *
 * Returns the files that we post-processed
 */
export async function ChangeDetectionWorkerThread(
  index: IDLIndex,
  token: CancellationToken,
  changed: GlobalTokens
): Promise<IChangeDetection> {
  /** Files that we will post-process again */
  const postProcessThese: string[] = [];

  /** Get files we know about */
  const files = index.parsedCache.allFiles();
  // const files = Array.from(index.fileTypes['pro']);

  // process each file
  for (let z = 0; z < files.length; z++) {
    // get our parsed file
    const uses = index.parsedCache.uses(files[z]);

    // skip if we dont have the lookup
    if (!uses) {
      continue;
    }

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

/*
 * Runs change detection for our main thread
 */
export async function ChangeDetectionMainThread(
  index: IDLIndex,
  token: CancellationToken,
  changed: GlobalTokens
) {
  /**
   * Get uniquely sorted names
   */
  let lastSorted = GetSortedGlobals(changed);

  /** Get the IDs of all of our workers */
  const ids = index.indexerPool.getIDs();

  /** Track the number of times we have recursed */
  let recursion = 0;

  /** Get time now */
  const t0 = performance.now();

  /** Exit flag if we have no changes */
  let noChanges = false;

  /** exit flag if we hit max iterations */
  let maxIter = false;

  /** Exit flag if we have the same globals */
  let sameGlobals = false;

  /** Track total number of tokens we update */
  let totalChanges = changed.length;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // check if we canceled
    token.throwIfCancelled();

    /**
     * Check exit conditions
     */
    if (changed.length === 0) {
      noChanges = true;
      break;
    }

    /**
     * Check exit conditions
     */
    if (recursion >= CHANGE_DETECTION_MAX_DEPTH) {
      maxIter = true;
      break;
    }

    /** track promises for async processing */
    const proms: Promise<ChangeDetectionResponse>[] = [];

    // send the messages
    for (let i = 0; i < ids.length; i++) {
      // track promise
      proms.push(
        index.indexerPool.workerio.postAndReceiveMessage(
          ids[i],
          LSP_WORKER_THREAD_MESSAGE_LOOKUP.CHANGE_DETECTION,
          { changed }
        ).response
      );
    }

    // wait for it to finish
    await Promise.all(proms);

    /**
     * Get additional changes
     */
    const changes = await ProcessChangeDetectionResults(index, proms);

    // update values
    changed = changes.changedGlobals;

    // update counter
    totalChanges += changed.length;

    // get sorted globals
    const newSorted = GetSortedGlobals(changed);

    /**
     * If we dont have any differences in our globals then
     * return
     */
    if (deepEqual(lastSorted, newSorted)) {
      sameGlobals = true;
      break;
    }

    // update last sorted globals
    lastSorted = newSorted;

    // bump counter
    recursion++;
  }

  // print log
  index.log.log({
    log: IDL_LSP_LOG,
    type: 'info',
    content: [
      `Finished change detection after updating ${totalChanges} global(s) with ${recursion} step(s) over ${Math.floor(
        performance.now() - t0
      )} ms, exit conditions:`,
      {
        noChanges,
        maxIter,
        sameGlobals,
      },
    ],
  });
}

/**
 * Runs change detection and executes proper logic based on us being the
 * main thread or the worker thread
 */
export async function ChangeDetection(
  index: IDLIndex,
  token: CancellationToken,
  changesOrNewGlobals: GlobalTokens,
  oldGlobals?: GlobalTokens
) {
  const changed = Array.isArray(oldGlobals)
    ? GetChangedGlobals(changesOrNewGlobals, oldGlobals)
    : changesOrNewGlobals;

  // verify we have changes in our global tokens
  if (changed.length > 0) {
    /**
     * Check if we run in our worker
     */
    if (index.isMultiThreaded()) {
      await ChangeDetectionMainThread(index, token, changed);
    } else {
      /**
       * Run locally
       */
      const change = await ChangeDetectionWorkerThread(index, token, changed);

      // check for missing files
      if (change.missing.length > 0) {
        await index.removeWorkspaceFiles(change.missing);
      }
    }
  }
}
