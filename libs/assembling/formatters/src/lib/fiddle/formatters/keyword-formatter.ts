import type { TokenName } from '@idl/tokenizer';

import type { TokenFormatter } from '../../formatter-rule-set.interface';

/**
 * Consistent formatting for keywords
 */
export const KEYWORD_FORMATTER: TokenFormatter<TokenName> = (token) => {
  token.match[0] = token.match[0].replace(/\s*/g, '');
};
