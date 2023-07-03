import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import {
  NUMBER_AS_DOUBLE_QUOTE,
  NUMBER_AS_SINGLE_QUOTE,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

/**
 * All of our tokens for numbers to process
 */
const NUMBERS = [TOKEN_NAMES.NUMBER];

for (let i = 0; i < NUMBERS.length; i++) {
  ASSEMBLER_DEFAULT_STYLING.onBasicToken(NUMBERS[i], (token, parsed, meta) => {
    // get match
    const match = token.match[0].toLowerCase();

    // get the quote to use
    const quote = meta.style.quotes === STYLE_FLAG_LOOKUP.SINGLE ? `'` : `"`;

    // CHECK HOW TO FORMAT
    switch (true) {
      case match.startsWith('0x'):
        if (meta.style.hex === STYLE_FLAG_LOOKUP.NONE) {
          return;
        }

        token.match[0] = `0x${AdjustCase(match.substring(2), meta.style.hex)}`;
        break;
      case match.startsWith('0o'):
        if (meta.style.octal === STYLE_FLAG_LOOKUP.NONE) {
          return;
        }

        token.match[0] = `0o${AdjustCase(
          match.substring(2),
          meta.style.octal
        )}`;
        break;
      case match.startsWith('0b'):
        if (meta.style.binary === STYLE_FLAG_LOOKUP.NONE) {
          return;
        }

        token.match[0] = `0b${AdjustCase(
          match.substring(2),
          meta.style.binary
        )}`;
        break;
      case NUMBER_AS_SINGLE_QUOTE.test(match):
        {
          if (meta.style.numbers === STYLE_FLAG_LOOKUP.NONE) {
            return;
          }

          // parse and get groups
          const res = NUMBER_AS_SINGLE_QUOTE.exec(match);

          // replace
          token.match[0] = `${quote}${AdjustCase(
            res[1],
            meta.style.numbers
          )}${quote}${res[2]}${AdjustCase(
            res[3] ? res[3] : '',
            meta.style.numbers
          )}`;
        }
        break;
      case NUMBER_AS_DOUBLE_QUOTE.test(match):
        {
          if (meta.style.numbers === STYLE_FLAG_LOOKUP.NONE) {
            return;
          }

          // parse and get groups
          const res = NUMBER_AS_DOUBLE_QUOTE.exec(match);

          // check if we have two quotes or just one
          if (/"([^"]+)"/.test(match)) {
            // replace
            token.match[0] = `${quote}${AdjustCase(
              res[1],
              meta.style.numbers
            )}${quote}${res[2]}${AdjustCase(
              res[3] ? res[3] : '',
              meta.style.numbers
            )}`;
          } else {
            // only one quote so we have short-hand octal and have
            token.match[0] = AdjustCase(match, meta.style.numbers);
          }
        }
        break;
      default:
        if (meta.style.numbers === STYLE_FLAG_LOOKUP.NONE) {
          return;
        }

        token.match[0] = AdjustCase(match, meta.style.numbers);
        break;
    }
  });
}
