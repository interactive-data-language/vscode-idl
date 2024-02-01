import { GlobalTokens } from '@idl/types/core';

import { IDL_USER_DISPLAY_NAMES } from './user-display-names.interface';

/**
 * Removes global token display names as we remove files to keep
 * auto complete in sync with path and known code
 */
export function RemoveGlobalDisplayNames(global: GlobalTokens) {
  // process all global routines
  for (let i = 0; i < global.length; i++) {
    delete IDL_USER_DISPLAY_NAMES[global[i].type][global[i].name];
  }
}
