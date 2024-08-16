import { StructureToken, TOKEN_NAMES } from '@idl/tokenizer';

import { TokenFormatter } from '../../formatter-rule-set.interface';

/**
 * Parents that trigger custom formatting
 */
const OK_PARENTS: { [key: string]: any } = {};
OK_PARENTS[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
OK_PARENTS[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;

/**
 * Consistent formatting for structures
 */
export const STRUCTURE_FORMATTER: TokenFormatter<StructureToken> = (
  token,
  meta,
  parsed
) => {
  // only process def files
  if (parsed.type !== 'def') {
    return;
  }

  // check for proper parents
  if (token.scope[token.scope.length - 1] in OK_PARENTS) {
    token.match[0] = `!null = ${token.match[0]}`;
  }
};
