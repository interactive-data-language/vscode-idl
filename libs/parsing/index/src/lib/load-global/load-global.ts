import { GlobalTokens } from '@idl/data-types/core';
import { PopulateReserved } from '@idl/parsing/routines';
import { GetExtensionPath } from '@idl/shared';
import { readFileSync } from 'fs';

import { IDL_INDEX_OPTIONS } from '../idl-index.interface';
import { ReduceGlobals } from './reduce-globals';

/**
 * Global tokens for IDL
 */
export let IDL_GLOBAL_TOKENS: GlobalTokens = [];

/**
 * Function that loads global tokens as a helper method to reduce memory footprint
 * and only store what we need
 */
export function LoadGlobal(okToLoad?: { [key: string]: any }) {
  // if test, check if we have loaded already
  if (IDL_INDEX_OPTIONS.IS_TEST && IDL_GLOBAL_TOKENS.length > 0) {
    return;
  }

  /** Load from disk */
  const fromDisk: GlobalTokens = JSON.parse(
    readFileSync(GetExtensionPath('idl/routines/global.json'), {
      encoding: 'utf-8',
    })
  ) as GlobalTokens;

  // load tokens and filter ones we shouldnt have
  const loaded =
    IDL_INDEX_OPTIONS.IS_TEST || okToLoad === undefined
      ? fromDisk
      : fromDisk.filter((item) =>
          !item.meta.source ? true : item.meta.source in okToLoad
        );

  /**
   * If we are not the main thread, then reduce all globals before filtering
   */
  if (!IDL_INDEX_OPTIONS.IS_MAIN_THREAD) {
    ReduceGlobals(loaded);
  }

  // update constant
  IDL_GLOBAL_TOKENS = loaded;

  // populate our reserved routines
  PopulateReserved(IDL_GLOBAL_TOKENS);
}
