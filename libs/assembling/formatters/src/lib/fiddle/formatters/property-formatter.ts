import { TokenName } from '@idl/tokenizer';

import { TokenFormatter } from '../../formatter-rule-set.interface';

/**
 * Consistent formatting for properties
 */
export const PROPERTY_FORMATTER: TokenFormatter<TokenName> = (
  token,
  meta,
  parsed
) => {
  token.match[0] = token.match[0].replace(/\s*/g, '');

  // if def file, add some code for the value of the property
  if (parsed.type === 'def') {
    token.match[0] = `${token.match[0]} !null`;
  }
};
