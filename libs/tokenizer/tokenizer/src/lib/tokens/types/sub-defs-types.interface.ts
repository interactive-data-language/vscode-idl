/**
 * This file contains the tokens we search for when we find another token.
 *
 * For example: when we find a string or comment, allwe check for are strings or other comments
 */

import { ITokenDef, TOKEN_NAMES, TokenName } from '../../tokens.interface';
import { TYPE_FUNCTION_TOKENS } from './def-groups-types.interface';

export interface ISubTokenDefs {
  [key: string]: ITokenDef<TokenName>[];
}

/**
 * The tokens we check for when we found a specific token
 */
export const SUB_DEFS_TYPES: ISubTokenDefs = {};

// routine definitions
SUB_DEFS_TYPES[TOKEN_NAMES.TYPE_FUNCTION] = TYPE_FUNCTION_TOKENS;
