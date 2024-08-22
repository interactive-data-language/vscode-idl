import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { TOKEN_NAMES } from '@idl/tokenizer';

ASSEMBLER_DEFAULT_STYLING.onBasicToken(TOKEN_NAMES.PROMPT, (token) => {
  token.match[0] = token.match[0].toUpperCase();
});
