import {
  AccessPropertyToken,
  ITokenDef,
  TOKEN_NAMES,
} from '../../tokens.interface';

export type AccessPropertyTokenDef = ITokenDef<AccessPropertyToken>;

/**
 * Regex to find variable assignment
 */
export const ACCESS_PROPERTY: AccessPropertyTokenDef = {
  name: TOKEN_NAMES.ACCESS_PROPERTY,
  // we need to have the more specific first start for the property so we
  // dont grab decimals
  match: /\.[a-z_][a-z0-9_$]*/im,
};

/**
 * Matches detected by accessing properties
 * @param {string} match Full match
 */
export type AccessPropertyMatches = [match: string];
