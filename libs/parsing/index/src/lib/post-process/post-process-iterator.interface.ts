import { TOKEN_NAMES } from '@idl/tokenizer';

/**
 * Branches that we make magic happen for
 */
export const RECURSE_INTO: { [key: string]: undefined } = {};
RECURSE_INTO[TOKEN_NAMES.ROUTINE_FUNCTION] = undefined;
RECURSE_INTO[TOKEN_NAMES.ROUTINE_PROCEDURE] = undefined;
RECURSE_INTO[TOKEN_NAMES.MAIN_LEVEL] = undefined;
