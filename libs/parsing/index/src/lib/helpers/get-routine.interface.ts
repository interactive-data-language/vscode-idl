import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Names of tokens that represent routine names
 */
export const ROUTINE_NAME_TOKENS: { [key: string]: boolean } = {};
ROUTINE_NAME_TOKENS[TOKEN_NAMES.ROUTINE_NAME] = true;
ROUTINE_NAME_TOKENS[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;
