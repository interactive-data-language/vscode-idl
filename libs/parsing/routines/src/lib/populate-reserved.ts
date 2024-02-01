import {
  GLOBAL_TOKEN_SOURCE_LOOKUP,
  GLOBAL_TOKEN_TYPES,
  GlobalTokens,
} from '@idl/types/core';

import {
  RESERVED_FUNCTION_METHODS,
  RESERVED_FUNCTIONS,
  RESERVED_PROCEDURE_METHODS,
  RESERVED_PROCEDURES,
} from './reserved.interface';

/**
 * Populates reserved names based on the globals that we have loaded from IDL
 */
export function PopulateReserved(globals: GlobalTokens) {
  // populate constants with values
  for (let i = 0; i < globals.length; i++) {
    // get routine
    const rout = globals[i];

    // skip null routine names and routines that are not truly internal
    if (
      rout.name === null ||
      rout.name === undefined ||
      rout.meta.source !== GLOBAL_TOKEN_SOURCE_LOOKUP.INTERNAL
    ) {
      continue;
    }

    // get the name
    const name = rout.name.toLowerCase();

    // check where to save it
    switch (rout.type) {
      // function method
      case GLOBAL_TOKEN_TYPES.FUNCTION_METHOD:
        RESERVED_FUNCTION_METHODS[name] = i;
        break;
      // procedure method
      case GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD:
        RESERVED_PROCEDURE_METHODS[name] = i;
        break;
      // procedure
      case GLOBAL_TOKEN_TYPES.PROCEDURE:
        RESERVED_PROCEDURES[name] = i;
        break;
      // function
      case GLOBAL_TOKEN_TYPES.FUNCTION:
        RESERVED_FUNCTIONS[name] = i;
        break;
      default:
        break;
    }
  }
}
