import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * All of our tokens for methods to process
 */
const METHODS = [
  TOKEN_NAMES.CALL_FUNCTION_METHOD,
  TOKEN_NAMES.CALL_PROCEDURE_METHOD,
];

for (let i = 0; i < METHODS.length; i++) {
  ASSEMBLER_DEFAULT_STYLING.onBranchToken(METHODS[i], (token, parsed, meta) => {
    // check if we should ignore formatting
    if (meta.style.methods === STYLE_FLAG_LOOKUP.NONE) {
      return;
    }

    switch (meta.style.methods) {
      case STYLE_FLAG_LOOKUP.DOT:
        token.match[0] = token.match[0].replace('->', '.');
        break;
      case STYLE_FLAG_LOOKUP.ARROW:
        token.match[0] = token.match[0].replace('.', '->');
        break;
      default:
      // do nothing
    }
  });
}
