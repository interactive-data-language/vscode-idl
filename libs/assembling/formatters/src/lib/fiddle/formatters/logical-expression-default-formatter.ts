import { LogicalExpressionDefaultToken } from '@idl/parsing/tokenizer';

import { TokenFormatter } from '../../formatter-rule-set.interface';

/**
 * Consistent formatting for default logical expressions
 *
 * Needed since the colon and else are separate from one another
 */
export const LOGICAL_EXPRESSION_DEFAULT_FORMATTER: TokenFormatter<
  LogicalExpressionDefaultToken
> = (token) => {
  token.match[0] = token.match[0].replace(/\s/g, '');
};
