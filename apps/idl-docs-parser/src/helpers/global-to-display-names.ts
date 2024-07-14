import { GlobalDisplayNameLookup, IGlobalFromIDL } from '@idl/parsing/routines';
import { GLOBAL_TOKEN_TYPES, GlobalTokens } from '@idl/types/core';

/**
 * Converts our pre-parsed IDL routine and docs information into global tokens that can plug directly
 * into our index for use like any other routine
 */
export function GlobalToDisplayNames(
  global: GlobalTokens
): GlobalDisplayNameLookup {
  // store display names by routine type
  const lookup: GlobalDisplayNameLookup = {};

  // set all global tokens
  const types = Object.values(GLOBAL_TOKEN_TYPES);
  for (let i = 0; i < types.length; i++) {
    lookup[types[i]] = {};
  }

  // process all global tokens to save the lower case and display name to use
  for (let i = 0; i < global.length; i++) {
    lookup[global[i].type][global[i].name] = global[i].meta.display;
  }

  return lookup;
}

/**
 * Converts our pre-parsed IDL routines to display names
 */
export function GlobalFromIDLToDisplayNames(
  global: IGlobalFromIDL[]
): GlobalDisplayNameLookup {
  // store display names by routine type
  const lookup: GlobalDisplayNameLookup = {};

  // set all global tokens
  const types = Object.values(GLOBAL_TOKEN_TYPES);
  for (let i = 0; i < types.length; i++) {
    lookup[types[i]] = {};
  }

  // process all global tokens to save the lower case and display name to use
  for (let i = 0; i < global.length; i++) {
    lookup[global[i].type][
      global[i].name === null ? 'null' : global[i].name.toLowerCase()
    ] = global[i].link;
  }

  return lookup;
}
