import { ITokenDef, TokenName } from '../tokens.interface';
import { ASSIGNMENT } from './defs/assignment.interface';
import { COMMA } from './defs/commas.interface';
import {
  STRUCTURE_INHERITANCE,
  STRUCTURE_NAME,
  STRUCTURE_PROPERTY,
} from './defs/structure.interface';
import { VARIABLE } from './defs/variables.interface';

/**
 * Tokens to find in routine names
 */
export const ROUTINE_NAME_FAST_TOKENS: ITokenDef<TokenName>[] = [
  VARIABLE,
  ASSIGNMENT,
  COMMA,
];

/**
 * Tokens to use when we encounter an expression like logical statements, if statements,
 * or portions of loops.
 */
export const EXPRESSION_TOKENS_FAST: ITokenDef<TokenName>[] = [VARIABLE];

/**
 * Tokens to find in structures
 */
export const STRUCTURE_FAST_TOKENS: ITokenDef<TokenName>[] = [
  STRUCTURE_NAME,
  STRUCTURE_INHERITANCE,
  STRUCTURE_PROPERTY,
  COMMA,
];

/**
 * Tokens for named structures
 */
export const NAMED_STRUCTURE_FAST_TOKENS: ITokenDef<TokenName>[] = [
  STRUCTURE_INHERITANCE,
  STRUCTURE_PROPERTY,
  COMMA,
];
