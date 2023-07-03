import { ASSEMBLER_PRE_PROCESSOR } from '@idl/assembling/tree-handlers';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * NOT USED
 */
ASSEMBLER_PRE_PROCESSOR.onBasicToken(
  TOKEN_NAMES.LINE_SEPARATION_BASIC,
  (token) => {
    token.matches[0] = '';
  }
);

/**
 * NOT USED
 */
ASSEMBLER_PRE_PROCESSOR.onBranchToken(TOKEN_NAMES.LINE_SEPARATION, (token) => {
  token.matches[0] = '';
});
