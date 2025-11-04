import { IDL_NUMBER_REGEX } from '@idl/types/tokenizer';

import { ITokenDef, NumberToken, TOKEN_NAMES } from '../../tokens.interface';

export type NumberTokenDef = ITokenDef<NumberToken>;

/**
 * Regex for blocks using a begin statement
 */
export const NUMBER: NumberTokenDef = {
  name: TOKEN_NAMES.NUMBER,
  match: IDL_NUMBER_REGEX,
};
