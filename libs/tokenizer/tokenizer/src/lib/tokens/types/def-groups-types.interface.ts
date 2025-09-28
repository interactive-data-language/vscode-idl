import { ITokenDef, TokenName } from '../../tokens.interface';
import { COMMA } from '../defs/commas.interface';
import { NUMBER } from '../defs/numbers.interface';
import { QUOTE_DOUBLE, QUOTE_SINGLE } from '../defs/quotes.interface';
import { TYPE_FUNCTION } from '../defs/types.type-function.interface';
import { TYPE_OR_OPERATOR } from '../defs/types.type-or.interface';
import { TYPE_VARIABLE } from '../defs/types.type-variable.interface';

/**
 * Tokens we use when initially parsing a type
 */
export const ALL_TYPE_TOKENS: ITokenDef<TokenName>[] = [
  TYPE_FUNCTION,
  TYPE_VARIABLE,
  QUOTE_DOUBLE,
  QUOTE_SINGLE,
  NUMBER,
  TYPE_OR_OPERATOR,
];

/**
 * Tokens we extract when inside a type function
 */
export const TYPE_FUNCTION_TOKENS: ITokenDef<TokenName>[] =
  ALL_TYPE_TOKENS.concat([COMMA]);
