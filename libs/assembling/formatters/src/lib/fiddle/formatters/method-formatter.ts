import {
  CallFunctionMethodToken,
  CallProcedureMethodToken,
} from '@idl/parsing/tokenizer';

import { TokenFormatter } from '../../formatter-rule-set.interface';

/**
 * Formats method calls to
 */
export const METHOD_FORMATTER: TokenFormatter<
  CallFunctionMethodToken | CallProcedureMethodToken
> = (token, meta) => {
  token.match[0] = token.match[0].replace(/\s/g, '');
};
