import {
  GLOBAL_TOKEN_TYPES,
  GlobalStructureToken,
  GlobalTokens,
  IGlobalIndexedToken,
} from '@idl/data-types/core';

import { GET_KEYWORDS_FROM } from '../overrides/properties-and-keywords/get-keywords-from';
import { UpdateThese } from './set-keywords-as-properties.interface';
import { GetMatch } from './set-keywords-from-properties';

/**
 * implements the logs to borrow keywords
 */
function DoTheBorrowing(global: GlobalTokens, toProcess: UpdateThese) {
  // skip bad files
  if (toProcess.length < 2) {
    return;
  }

  // find our reference
  const ref = GetMatch(global, toProcess[0][0], toProcess[0][1]);

  // skip if nothing found
  if (ref.length === 0) {
    return;
  }

  // get first match, assume it is the only one
  const update = ref[0];

  // make sure we have keywords
  if ('kws' in update.meta) {
    // find others
    const toMerge = toProcess.slice(1);
    for (let j = 0; j < toMerge.length; j++) {
      const mergeThese = GetMatch(global, toMerge[j][0], toMerge[j][1]);

      // process all matches
      for (let z = 0; z < mergeThese.length; z++) {
        if ('kws' in mergeThese[z].meta) {
          Object.assign(update.meta.kws, mergeThese[z].meta.kws);
        }
      }
    }
  }
}

/**
 * Gets/inherits keywords from other routines
 *
 * Also processes all structures and makes sure we have keywords
 * between the docs for our init method and function matching the
 * class name
 */
export function BorrowKeywordsFrom(global: GlobalTokens) {
  // process manually added items
  const process = Object.values(GET_KEYWORDS_FROM);
  for (let i = 0; i < process.length; i++) {
    DoTheBorrowing(global, process[i]);
  }

  // do the same for all structures
  // update all graphics routines
  const structures = global.filter(
    (item) => item.type === GLOBAL_TOKEN_TYPES.STRUCTURE
  ) as IGlobalIndexedToken<GlobalStructureToken>[];

  // process each structure
  for (let i = 0; i < structures.length; i++) {
    DoTheBorrowing(global, [
      [`${structures[i].name}`, GLOBAL_TOKEN_TYPES.FUNCTION],
      [`${structures[i].name}::init`, GLOBAL_TOKEN_TYPES.FUNCTION_METHOD],
    ]);
  }
}
