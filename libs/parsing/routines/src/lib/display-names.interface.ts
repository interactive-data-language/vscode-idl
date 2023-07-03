import { GLOBAL_TOKEN_TYPES } from '@idl/data-types/core';

import { MANUAL_FUNCTION_METHOD_DISPLAY_NAMES } from './display-overrides/manual-function-methods.interface';
import { MANUAL_FUNCTION_DISPLAY_NAMES } from './display-overrides/manual-functions.interface';
import { MANUAL_PROCEDURE_METHOD_DISPLAY_NAMES } from './display-overrides/manual-procedure-methods.interface';
import { MANUAL_PROCEDURE_DISPLAY_NAMES } from './display-overrides/manual-procedures.interface';
import { GlobalDisplayNameLookup } from './routines.interface';

/**
 * Lookup of the display names for symbols in idl
 *
 * First key: type of global
 * Second key: lower-case name
 * Value: Display name
 */
export const IDL_DISPLAY_NAMES: GlobalDisplayNameLookup = {};

// set defaults for all types
const types = Object.values(GLOBAL_TOKEN_TYPES);
for (let i = 0; i < types.length; i++) {
  IDL_DISPLAY_NAMES[types[i]] = {};
}

// process all manual values
let keys = Object.keys(MANUAL_FUNCTION_DISPLAY_NAMES);
for (let i = 0; i < keys.length; i++) {
  IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.FUNCTION][keys[i]] =
    MANUAL_FUNCTION_DISPLAY_NAMES[keys[i]];
}
keys = Object.keys(MANUAL_FUNCTION_METHOD_DISPLAY_NAMES);
for (let i = 0; i < keys.length; i++) {
  IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD][keys[i]] =
    MANUAL_FUNCTION_METHOD_DISPLAY_NAMES[keys[i]];
}
keys = Object.keys(MANUAL_PROCEDURE_DISPLAY_NAMES);
for (let i = 0; i < keys.length; i++) {
  IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.PROCEDURE][keys[i]] =
    MANUAL_PROCEDURE_DISPLAY_NAMES[keys[i]];
}
keys = Object.keys(MANUAL_PROCEDURE_METHOD_DISPLAY_NAMES);
for (let i = 0; i < keys.length; i++) {
  IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD][keys[i]] =
    MANUAL_PROCEDURE_METHOD_DISPLAY_NAMES[keys[i]];
}
