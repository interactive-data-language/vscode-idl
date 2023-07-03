import { ITokenDef, TOKEN_NAMES, UnknownToken } from '../../tokens.interface';

export type UnknownTokenDef = ITokenDef<UnknownToken>;

/**
 * Regex to find variable assignment
 *
 * @deprecated No longer used. This logic is built into the iterator "shift" and "findLeftovers" methods
 */
export const UNKNOWN: UnknownTokenDef = {
  name: TOKEN_NAMES.UNKNOWN,
  match: /[^\s\r\n]+/im,
};

/**
 * Matches for unknown tokens
 *
 * @param {string} unknown Full match for unknown token, may include training/leading spaces
 */
export type UnknownMatches = [unknown: string];
