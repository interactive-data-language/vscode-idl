import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { CUSTOM_TYPE_DISPLAY_NAMES, GLOBAL_TOKEN_TYPES } from '@idl/types/core';

import { IDL_GLOBAL_TOKENS } from '../load-global/load-global';

/**
 * Clears all global display names
 */
export function ResetGlobalDisplayNames() {
  // reset IDL's display names
  const types = Object.values(GLOBAL_TOKEN_TYPES);
  for (let i = 0; i < types.length; i++) {
    // remove all existing keys, use same object instead of making new one
    const byType = IDL_DISPLAY_NAMES[types[i]];
    const names = Object.keys(byType);
    for (let j = 0; j < names.length; j++) {
      delete byType[names[j]];
    }
  }

  // set all global tokens from docs
  for (let i = 0; i < IDL_GLOBAL_TOKENS.length; i++) {
    IDL_DISPLAY_NAMES[IDL_GLOBAL_TOKENS[i].type][IDL_GLOBAL_TOKENS[i].name] =
      IDL_GLOBAL_TOKENS[i].meta.display;
  }

  // clear type display names
  const typeNames = Object.keys(CUSTOM_TYPE_DISPLAY_NAMES);
  for (let z = 0; z < typeNames.length; z++) {
    delete CUSTOM_TYPE_DISPLAY_NAMES[typeNames[z]];
  }
}
