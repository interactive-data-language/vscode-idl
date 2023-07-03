import {
  ITokenDef,
  NumberToken,
  QuoteDoubleToken,
  QuoteSingleToken,
  TOKEN_NAMES,
} from '../../tokens.interface';
import {
  NUMBER_AS_DOUBLE_QUOTE,
  NUMBER_AS_SINGLE_QUOTE,
} from '../regex.interface';

/**
 * Regex to test that number strings are valid
 */
export const STRING_NUMBER_TEST = /^(b|o|x)(\b|b|us|ull|ul|ll|l|s|u|i|j)*$/i;

/**
 * Makes sure an extracted binary string is valid and only contains 1's and 0's
 */
export const BINARY_STRING_TEST = /^[01]*$/i;

/**
 * Makes sure an extracted hex string has valid characters
 */
export const HEX_STRING_TEST = /^[0-9a-f]*$/i;

/**
 * Makes sure an extracted octal string has valid characters
 */
export const OCTAL_STRING_TEST = /^[0-7]*$/i;

export type QuoteSingleTokenDef = ITokenDef<QuoteSingleToken | NumberToken>;

/**
 * Regex to find single quotes
 */
export const QUOTE_SINGLE: QuoteSingleTokenDef = {
  name: TOKEN_NAMES.QUOTE_SINGLE,
  /**
   * Escaped quotes are not caught with this regex, instead a post-processor joins adjacent
   * strings. This dramatically simplifies the regex and is easier to maintain/update.
   *
   * The different expressions are for 'string', '1010101'[oxb], and 'missing-close
   */
  match: /'([^']*)'((?!then|else|of|do|until)[a-z]+\b)?|'(.*)$/im,
  // start: /'([^']*)'?((?!then|else|of|do|until)[a-z]+\b)?/im,
  getTokenName: (matches) => {
    if (NUMBER_AS_SINGLE_QUOTE.test(matches[0])) {
      return TOKEN_NAMES.NUMBER;
    } else {
      return TOKEN_NAMES.QUOTE_SINGLE;
    }
  },
};

/**
 * Double quotes can be either numbers or strings
 */
export type QuoteDoubleTokenDef = ITokenDef<QuoteDoubleToken | NumberToken>;

/**
 * Regex to find double quotes
 */
export const QUOTE_DOUBLE: QuoteDoubleTokenDef = {
  name: TOKEN_NAMES.QUOTE_DOUBLE,
  /**
   * Escaped quotes are not caught with this regex, instead a post-processor joins adjacent
   * strings. This dramatically simplifies the regex and is easier to maintain/update.
   *
   * The different expressions are for "string", "1010101"[oxb], "42, and "missing-close
   */
  match:
    /"([0-7]+)([a-z]{0,3})\b(?!"|\.)|"([^"]*)"((?!then|else|of|do|until)[a-z]+\b)?|"(.*)$/im,
  //  start:
  //  /([0-7]+)([a-z]{0,3})\b(?!"|\.)|"([^"]*)"?((?!then|else|of|do|until)[a-z]+\b)?/im,
  getTokenName: (matches) => {
    if (NUMBER_AS_DOUBLE_QUOTE.test(matches[0])) {
      return TOKEN_NAMES.NUMBER;
    } else {
      return TOKEN_NAMES.QUOTE_DOUBLE;
    }
  },
};

/**
 * Matches for single and double quotes
 *
 * @param {string} fullMatch Full match for method name
 * @param {string} string Content of the string that we extracted
 */
export type QuoteMatches = [fullMatch: string, string: string];
