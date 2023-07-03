import { CaseStyleFlags } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Helper function to adjust the display of keywords
 */
export function FormatKeyword(kw: string, style: CaseStyleFlags) {
  return AdjustCase(kw.replace(/\s/g, ''), style);
}

/**
 * All of our tokens for keywords
 */
const KEYWORDS = [
  TOKEN_NAMES.KEYWORD,
  TOKEN_NAMES.KEYWORD_BINARY,
  TOKEN_NAMES.KEYWORD_DEFINITION,
];

for (let i = 0; i < KEYWORDS.length; i++) {
  ASSEMBLER_DEFAULT_STYLING.onBasicToken(KEYWORDS[i], (token, parsed, meta) => {
    token.match[0] = FormatKeyword(token.match[0], meta.style.keywords);
  });
}
