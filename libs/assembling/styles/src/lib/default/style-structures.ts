import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

// handle inheritance statements
ASSEMBLER_DEFAULT_STYLING.onBasicToken(
  TOKEN_NAMES.STRUCTURE_INHERITANCE,
  (token, parsed, meta) => {
    switch (meta.style.control) {
      case STYLE_FLAG_LOOKUP.LOWER:
        token.match[0] = token.match[0].replace(/inherits/gim, 'inherits');
        break;
      case STYLE_FLAG_LOOKUP.UPPER:
        token.match[0] = token.match[0].replace(/inherits/gim, 'INHERITS');
        break;
      default:
        // do nothing
        break;
    }
  }
);

// handle inheritance statements
ASSEMBLER_DEFAULT_STYLING.onBranchToken(
  TOKEN_NAMES.STRUCTURE_NAME,
  (token, parsed, meta) => {
    // check if our structure name is a system variable
    if (token.match[0].startsWith('!')) {
      token.match[0] = AdjustCase(token.match[0], meta.style.systemVariables);
    }
  }
);
