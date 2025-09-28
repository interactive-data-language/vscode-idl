/**
 * Regex to test text as being an IDL number
 *
 * Handles all cases for IDL numbers
 */
export const IDL_NUMBER_REGEX =
  /(?<![a-z_$])(?:0[box][a-z0-9]*|[0-9.]+(?:(?:e|d)\+?-?[0-9]*|[a-z]*))(?:i|j)?/im;
