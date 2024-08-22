import { TOKEN_NAMES } from '@idl/tokenizer';

/**
 * Tokens that are allowed in a batch cell
 */
export const BATCH_CELL_TOKENS: { [key: string]: undefined } = {};
BATCH_CELL_TOKENS[TOKEN_NAMES.COMMENT] = undefined;
BATCH_CELL_TOKENS[TOKEN_NAMES.COMMENT_BLOCK] = undefined;
BATCH_CELL_TOKENS[TOKEN_NAMES.EXECUTIVE_COMMAND] = undefined;
