// specify all of our reserved keywords
const reserved: string[] = [
  'for',
  'foreach',
  'while',
  'do',
  'repeat',
  'until',
  'if',
  'then',
  'else',
  'switch',
  'case',
  'of',
  'begin',
  'end',
  'endif',
  'endelse',
  'endfor',
  'endforeach',
  'endrep',
  'endwhile',
  'endswitch',
  'endcase',
  'pro',
  'function',
  'break',
  'continue',
  'common',
  'compile_opt',
  'forward_function',
  'goto',
  'mod',
  'not',
  'eq',
  'ne',
  'le',
  'lt',
  'ge',
  'gt',
  'and',
  'or',
  'xor',
  'inherits',
];

/**
 * All reserved works within IDL to invalidate function names, variables, procedure calls, etc
 */
export const RESERVED_WORDS: { [key: string]: boolean } = {};

// populate
for (let i = 0; i < reserved.length; i++) {
  RESERVED_WORDS[reserved[i]] = true;
}
