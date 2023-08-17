/**
 * This file contains the tokens we search for when we find another token.
 *
 * For example: when we find a string or comment, allwe check for are strings or other comments
 */

import { ITokenDef, TOKEN_NAMES, TokenName } from '../tokens.interface';
import {
  EXPRESSION_TOKENS_FAST,
  NAMED_STRUCTURE_FAST_TOKENS,
  ROUTINE_NAME_FAST_TOKENS,
  STRUCTURE_FAST_TOKENS,
} from './def-groups-fast.interface';
import { ROUTINE_NAME } from './defs/routines.definition.interface';

export interface ISubTokenDefs {
  [key: string]: ITokenDef<TokenName>[];
}

/**
 * The tokens we check for when we found a specific token
 */
export const SUB_DEFS_FAST: ISubTokenDefs = {};

// set all tokens to no children
const vals = Object.values(TOKEN_NAMES);
for (let i = 0; i < vals.length; i++) {
  SUB_DEFS_FAST[vals[i]] = [];
}

// routine definitions
SUB_DEFS_FAST[TOKEN_NAMES.ROUTINE_FUNCTION] = [ROUTINE_NAME];
SUB_DEFS_FAST[TOKEN_NAMES.ROUTINE_PROCEDURE] = [ROUTINE_NAME];
SUB_DEFS_FAST[TOKEN_NAMES.ROUTINE_NAME] = ROUTINE_NAME_FAST_TOKENS;
SUB_DEFS_FAST[TOKEN_NAMES.ROUTINE_METHOD_NAME] = ROUTINE_NAME_FAST_TOKENS;

// tokens for assignment
SUB_DEFS_FAST[TOKEN_NAMES.ASSIGNMENT] = EXPRESSION_TOKENS_FAST;

// tokens for structures
SUB_DEFS_FAST[TOKEN_NAMES.STRUCTURE] = STRUCTURE_FAST_TOKENS;
SUB_DEFS_FAST[TOKEN_NAMES.STRUCTURE_NAME] = NAMED_STRUCTURE_FAST_TOKENS;
