import { CancellationToken } from '@idl/cancellation-tokens';
import { CodeChecksum } from '@idl/parser';
import { IParsed } from '@idl/parsing/syntax-tree';
import { LSP_WORKER_THREAD_MESSAGE_LOOKUP } from '@idl/workers/parsing';
import copy from 'fast-copy';

import { IGetParsedPROCodePending } from './get-parsed-pro-code.interface';
import { GetSyntaxProblems } from './helpers/get-syntax-problems';
import { IDLIndex } from './idl-index.class';
import {
  DEFAULT_INDEX_PRO_CODE_OPTIONS,
  IIndexProCodeOptions,
} from './idl-index.interface';
/**
 * Track the pending files
 */
const PENDING_PRO_CODE: { [key: string]: IGetParsedPROCodePending } = {};

/**
 * Get parsed PRO code
 *
 * This is where the logic lives to check pending files and cancel pending requests
 */
export async function GetParsedPROCode(
  index: IDLIndex,
  file: string,
  code: string | string[],
  options: Partial<IIndexProCodeOptions> = {}
): Promise<IParsed> {
  /**
   * Get the checksum of our code
   */
  const checksum = CodeChecksum(code);

  /**
   * Make a cancellation token in case we need it
   */
  const token = new CancellationToken();

  switch (true) {
    /**
     * Check if we are a notebook cell
     */
    case index.isIDLNotebookFile(file): {
      /**
       * If we have a pending notebook file, pause
       * and wait for it to finish before we do anything
       */
      const base = file.split('#')[0];
      if (base in index.pendingNotebooks) {
        await index.pendingNotebooks[base];
      }

      /**
       * Check if we are multi threaded and need to fetch our file from
       * the worker
       *
       * TODO: Add in proper cancellation and logic for this
       */
      if (index.isMultiThreaded()) {
        return index.indexerPool.workerio.postAndReceiveMessage(
          index.getWorkerID(base),
          LSP_WORKER_THREAD_MESSAGE_LOOKUP.GET_NOTEBOOK_CELL,
          {
            file,
            code,
          }
        ).response;
      } else {
        if (index.tokensByFile.has(file)) {
          return index.tokensByFile.get(file);
        } else {
          // make new pending
          const newPending: IGetParsedPROCodePending = {
            checksum,
            token,
            promise: index.indexProCode(file, code, token, options),
          };

          // save
          PENDING_PRO_CODE[file] = newPending;

          // wait for finish
          const res = await newPending.promise;

          // clean up
          delete PENDING_PRO_CODE[file];

          // return
          return res;
        }
      }
    }

    /**
     * Check for a pending file
     */
    case file in PENDING_PRO_CODE: {
      /**
       * Get pending file
       */
      const pending = PENDING_PRO_CODE[file];

      // check if our checksums are valid
      if (pending.checksum === checksum) {
        return pending.promise;
      } else {
        // different checksums, so mark as cancelled
        pending.token.cancel();
      }
      break;
    }

    /**
     * If multi-threaded, check if we have a copy of our parsed code
     *
     * Some duplication with indexProCode, but special case if we are multi threaded
     */
    case index.isMultiThreaded(): {
      const resp = index.indexerPool.workerio.postAndReceiveMessage(
        index.getWorkerID(file),
        LSP_WORKER_THREAD_MESSAGE_LOOKUP.PARSE_CODE,
        {
          file,
          code,
          ...Object.assign(copy(DEFAULT_INDEX_PRO_CODE_OPTIONS), options),
        }
      );

      const newPending: IGetParsedPROCodePending = {
        checksum,
        token: resp.token,
        promise: resp.response,
      };

      // save new pending file
      PENDING_PRO_CODE[file] = newPending;

      // get the latest - cache busting happens in the worker
      const current = await newPending.promise;

      // remove from local cache
      delete PENDING_PRO_CODE[file];

      // get current global tokens
      const oldGlobals = index.getGlobalsForFile(file);

      // save and sync global tokens
      await index.saveGlobalTokens(file, current.global);

      // track syntax problems
      index.trackSyntaxProblemsForFile(file, GetSyntaxProblems(current));

      // do change detection
      if (options.postProcess) {
        await index.changeDetection(token, current.global, oldGlobals);
      }

      // make sure that we never cache in memory if we are the main thread
      index.tokensByFile.remove(file);

      // return the tokens from the worker
      return current;
    }

    /**
     * Check if we have it stored locally
     */
    case index.tokensByFile.has(file): {
      if (index.tokensByFile.checksumMatches(file, checksum)) {
        return index.tokensByFile.get(file);
      }
      break;
    }
    default:
  }

  /**
   * Re-index our code
   */
  const newPending: IGetParsedPROCodePending = {
    checksum,
    token,
    promise: index.indexProCode(file, code, token, options),
  };

  // mark as pending
  PENDING_PRO_CODE[file] = newPending;

  // wait for finish
  const res = await newPending.promise;

  // clean up pending
  delete PENDING_PRO_CODE[file];

  // return result
  return res;
}
