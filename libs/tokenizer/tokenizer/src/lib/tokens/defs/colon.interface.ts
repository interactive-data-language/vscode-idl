import { ColonToken, ITokenDef, TOKEN_NAMES } from '../../tokens.interface';

export type ColonTokenDef = ITokenDef<ColonToken>;

/**
 * Regex for commas
 */
export const COLON: ColonTokenDef = {
  name: TOKEN_NAMES.COLON,
  match: /(?<!:):(?!:)/im,
};
