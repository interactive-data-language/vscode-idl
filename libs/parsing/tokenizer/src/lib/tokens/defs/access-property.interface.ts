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
  match: /(\.)([a-z_][a-z0-9_$]*)/im,
};

/**
 * Matches detected by accessing properties
 * @param {string} match Full match
 * @param {string} dot Property dot
 * @param {string} name Name of the property we are accessing.
 */
export type AccessPropertyMatches = [match: string, dot: string, name: string];
