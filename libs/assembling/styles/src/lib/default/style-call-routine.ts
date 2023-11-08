import { TransformCase } from '@idl/assembling/shared';
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

    // check if we have a known function
    if (low in FUNCTIONS) {
      token.match[0] = `${TransformCase(FUNCTIONS[low], meta.style.routines)}(`;
    } else {
      token.match[0] = TransformCase(
        token.match[0].replace(/\s/gim, ''),
        meta.style.routines
      );
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

    // check if we have a known procedure
    token.match[0] = TransformCase(
      low in PROCEDURES ? PROCEDURES[low] : token.match[0],
      meta.style.routines
    );
  }
);
