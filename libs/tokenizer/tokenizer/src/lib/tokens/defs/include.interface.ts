import { IncludeToken, ITokenDef, TOKEN_NAMES } from '../../tokens.interface';

export type IncludeTokenDef = ITokenDef<IncludeToken>;

/**
 * Regex to find include statements
 */
export const INCLUDE: IncludeTokenDef = {
  name: TOKEN_NAMES.INCLUDE,
  match: /@[^\s]*/im,
};
