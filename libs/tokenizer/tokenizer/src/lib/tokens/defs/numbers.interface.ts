import { ITokenDef, NumberToken, TOKEN_NAMES } from '../../tokens.interface';

/**
 * Regex to test that the text associated with a number os valid
 */
export const NUMBER_STRING_TEST = /(?:b|us|ull|ul|ll|l|s|u|d)(?:j|i)?/i;

export type NumberTokenDef = ITokenDef<NumberToken>;

/**
 * Regex for blocks using a begin statement
 */
export const NUMBER: NumberTokenDef = {
  name: TOKEN_NAMES.NUMBER,
  match:
    /(?<![a-z_$])(?:0[box][a-z0-9]*|[0-9.]+(?:(?:e|d)\+?-?[0-9]*|[a-z]*))(?:i|j)?/im,
};
