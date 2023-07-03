import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

ASSEMBLER_DEFAULT_STYLING.onBasicToken(
  TOKEN_NAMES.STRING_TEMPLATE_ESCAPE,
  (token, parsed, meta) => {
    const compare = token.match[0].toLowerCase();

    // hex, so lets format like all the other hexes
    if (compare.startsWith('\\x')) {
      switch (meta.style.hex) {
        case STYLE_FLAG_LOOKUP.NONE:
          // make sure we always have lower case, its a syntax error if we dont
          token.match[0] = `\\x${token.match[0].substring(2)}`;
          break;
        default:
          token.match[0] = `\\x${AdjustCase(
            compare.substring(2),
            meta.style.hex
          )}`;
          break;
      }
    }
  }
);
