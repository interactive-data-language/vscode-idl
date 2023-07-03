import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { TransformQuote } from '../helpers/transform-quote';

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

    // handle IDL's escaped quotes to match JS since that is the format
    // being processed by our library
    const useString =
      token.name === TOKEN_NAMES.QUOTE_DOUBLE
        ? `${token.match[1].replace(/""/gim, `\\x22`)}`
        : `${token.match[1].replace(/''/gim, `\\x27`)}`;

    // handle special cases
    let formatted = useString;
    switch (true) {
      // special cases we handle and dont format
      case meta.style.quotes === STYLE_FLAG_LOOKUP.SINGLE && formatted === `'`:
        token.match[0] = `"'"`;
        return;
      case meta.style.quotes === STYLE_FLAG_LOOKUP.DOUBLE && formatted === `"`:
        token.match[0] = `'"'`;
        return;
      default:
        // flip the flag for formatting because, for nested quotes, we
        // want the opposite of what wraps the outside text
        // this makes sure that double quotes inside of single quotes dont
        // accidentally get converted
        formatted = TransformQuote(
          useString,
          meta.style.quotes !== STYLE_FLAG_LOOKUP.SINGLE
        );
        break;
    }

    // handle escaped quotes to correct for formatting switch
    if (meta.style.quotes === STYLE_FLAG_LOOKUP.SINGLE) {
      token.match[0] = `'${formatted
        .replace(/\\x22/gim, `"`)
        .replace(/\\x27|\\'/gim, `''`)}'`;
    } else {
      token.match[0] = `"${formatted
        .replace(/\\x22|\\"/gim, `""`)
        .replace(/\\x27/gim, `'`)}"`;
    }
  });
}
