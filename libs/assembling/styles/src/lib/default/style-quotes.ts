import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * All of our tokens for numbers to process
 */
const QUOTES = [TOKEN_NAMES.QUOTE_DOUBLE, TOKEN_NAMES.QUOTE_SINGLE];

for (let i = 0; i < QUOTES.length; i++) {
  ASSEMBLER_DEFAULT_STYLING.onBasicToken(QUOTES[i], (token, parsed, meta) => {
    // check if we should ignore formatting
    if (meta.style.quotes === STYLE_FLAG_LOOKUP.NONE) {
      return;
    }

    /** Formatted quote */
    let formatted = token.match[1];

    /**
     * Normalize the internal quote
     */
    switch (true) {
      case meta.style.quotes === STYLE_FLAG_LOOKUP.SINGLE:
        // escape single quote characters when converting a double quote to a single quote
        if (token.name === TOKEN_NAMES.QUOTE_DOUBLE) {
          formatted = formatted.replace(/'/g, `''`).replace(/""/g, `"`);
        }
        formatted = `'${formatted}'`;
        break;
      case meta.style.quotes === STYLE_FLAG_LOOKUP.DOUBLE:
        // escape double quote characters when converting a single quote to a double quote
        if (token.name === TOKEN_NAMES.QUOTE_SINGLE) {
          formatted = formatted.replace(/"/g, `""`).replace(/''/g, `'`);
        }
        formatted = `"${formatted}"`;
        break;
      default:
        break;
    }

    // replace match
    token.match[0] = formatted;
  });
}
