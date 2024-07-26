import { CommaToken, ITokenDef, TOKEN_NAMES } from '../../tokens.interface';

export type CommaTokenDef = ITokenDef<CommaToken>;

/**
 * Regex for commas
 */
export const COMMA: CommaTokenDef = {
  name: TOKEN_NAMES.COMMA,
  match: /,/im,
};
