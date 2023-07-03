import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { GLOBAL_TOKEN_TYPES } from '@idl/data-types/core';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Display names for internal functions
 */
const FUNCTIONS = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.FUNCTION];

/**
 * Display names for internal procedures
 */
const PROCEDURES = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.PROCEDURE];

/**
 * Handle function formatting
 */
ASSEMBLER_DEFAULT_STYLING.onBranchToken(
  TOKEN_NAMES.CALL_FUNCTION,
  (token, parsed, meta) => {
    /** Lower-case name of routine */
    const low = token.match[1].replace(/\s/gim, '').toLowerCase();

    // determine how to proceed
    switch (true) {
      // check if internal function
      case low in FUNCTIONS:
        if (meta.style.routines === STYLE_FLAG_LOOKUP.MATCH) {
          token.match[0] = `${FUNCTIONS[low]}(`;
        }
        break;
      default:
        // do nothing
        break;
    }
  }
);

/**
 * Handle procedure formatting
 */
ASSEMBLER_DEFAULT_STYLING.onBranchToken(
  TOKEN_NAMES.CALL_PROCEDURE,
  (token, parsed, meta) => {
    /** Lower-case name of routine */
    const low = token.match[0].toLowerCase();

    // determine how to proceed
    switch (true) {
      // check if internal function
      case low in PROCEDURES:
        if (meta.style.routines === STYLE_FLAG_LOOKUP.MATCH) {
          token.match[0] = PROCEDURES[low];
        }
        break;
      default:
        // do nothing
        break;
    }
  }
);
