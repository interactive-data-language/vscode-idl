import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import {
  CUSTOM_TYPE_DISPLAY_NAMES,
  GLOBAL_TOKEN_TYPES,
  GlobalTokens,
} from '@idl/types/core';

/**
 * Adds any global tokens to our user display name lookup for global tokens
 *
 * This is added here as a safety check in case we aren't running
 * using the index class which populates this automatically.
 *
 * Every time this is called, it updates the name. This means if there are problems
 * and duplicate global routines, the last one found will win.
 */
export function SaveGlobalDisplayNames(global: GlobalTokens) {
  // process all global routines
  for (let i = 0; i < global.length; i++) {
    IDL_DISPLAY_NAMES[global[i].type][global[i].name] = global[i].meta.display;

    // save structure display names
    if (global[i].type === GLOBAL_TOKEN_TYPES.STRUCTURE) {
      CUSTOM_TYPE_DISPLAY_NAMES[global[i].name.trim()] = global[i].meta.display;
    }
  }
}
