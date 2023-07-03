import { BracketToken, ITokenDef, TOKEN_NAMES } from '../../tokens.interface';

export type BracketTokenDef = ITokenDef<BracketToken>;

/**
 * For matching brackets for array assignment
 *
 * @deprecated Now part of GROUPERS
 */
export const BRACKET: BracketTokenDef = {
  name: TOKEN_NAMES.BRACKET,
  match: /\[/im,
  end: /\]/im,
};
