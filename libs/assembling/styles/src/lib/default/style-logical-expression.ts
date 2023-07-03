import { AdjustCase } from '@idl/assembling/shared';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

ASSEMBLER_DEFAULT_STYLING.onBranchToken(
  TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT,
  (token, parsed, meta) => {
    token.match[0] = AdjustCase(token.match[0], meta.style.control);
  }
);
