import { StringTemplateString } from '@idl/parsing/tokenizer';

import { TokenFormatter } from '../../formatter-rule-set.interface';

/**
 * Dont apply trimming and return whole string
 *
 * Otherwise we get trimming by default
 */
export const STRING_TEMPLATE_STRING_FORMATTER: TokenFormatter<
  StringTemplateString
> = () => {
  // do nothing, leave token at default and override trimming
};
