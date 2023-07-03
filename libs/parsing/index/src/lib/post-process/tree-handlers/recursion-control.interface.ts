import { ITreeRecurserOptions } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * For these tokens, we recurse last
 */
const ORDER_CONTROL: { [key: string]: any } = {};
ORDER_CONTROL[TOKEN_NAMES.LOOP_FOREACH] = true;

/**
 * Skip all of these tokens
 */
const SKIP_THESE: { [key: string]: any } = {};
SKIP_THESE[TOKEN_NAMES.CALL_LAMBDA_FUNCTION] = true;

/**
 * For these tokens, we recurse first
 */
export const RECURSION_CONTROL: Partial<ITreeRecurserOptions> = {
  processBranchFirst: false,
  processBranchFirstFor: ORDER_CONTROL,
  skipTokens: SKIP_THESE,
};
