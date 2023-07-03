import { TokenName } from '@idl/parsing/tokenizer';

import { TokenFormatter } from '../../formatter-rule-set.interface';

/**
 * Consistent formatting for executive commands
 */
export const EXECUTIVE_COMMAND_FORMATTER: TokenFormatter<TokenName> = (
  token
) => {
  token.match[0] = token.match[0].trim();
};
