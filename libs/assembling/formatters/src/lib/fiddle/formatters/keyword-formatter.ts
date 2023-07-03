import { TokenName } from '@idl/parsing/tokenizer';

import { TokenFormatter } from '../../formatter-rule-set.interface';

/**
 * Consistent formatting for keywords
 */
export const KEYWORD_FORMATTER: TokenFormatter<TokenName> = (token) => {
  token.match[0] = token.match[0].replace(/\s*/g, '');
};
