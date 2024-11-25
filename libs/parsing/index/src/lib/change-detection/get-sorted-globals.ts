import { GlobalTokens } from '@idl/types/core';

/**
 * Returns sorted globals based on a combination of the type and
 * the name so we can tell if we have the same exact set of globals
 * during change detection
 */
export function GetSortedGlobals(globals: GlobalTokens) {
  return globals.map((item) => `${item.type}-${item.name}`).sort();
}
