import {
  IDL_PROBLEM_CODES,
  IDLProblemCode,
} from './idl-problem-codes.interface';

/**
 * Helper to map problem codes to an alias that is easier to read/understand
 */
export type ProblemCodeAliasLookup = {
  [property in IDLProblemCode]: string;
};

/**
 * Maps aliases back to problem codes
 */
export type ReverseProblemCodeAliasLookup = {
  [key: string]: IDLProblemCode;
};

/**
 * Lookup to map the problem code to an alias for better user-friendly experience
 */
export const IDL_PROBLEM_CODE_ALIAS_LOOKUP: ProblemCodeAliasLookup = {
  0: 'not-closed',
  1: 'unexpected-closer',
  2: 'unknown-branch',
  3: 'after-main',
  4: 'embarrassing-token',
  5: 'embarrassing-file',
  6: 'todo',
  7: 'unknown-token',
  8: 'illegal-arrow',
  9: 'illegal-comma',
  10: 'illegal-colon',
  11: 'illegal-include',
  12: 'reserved-var',
  13: 'illegal-ternary',
  14: 'colon-in-func',
  15: 'colon-in-func-method',
  16: 'double-token',
  17: 'illegal-struct',
  18: 'illegal-paren',
  19: 'illegal-bracket',
  20: 'return-vals-pro',
  21: 'return-vals-func',
  22: 'return-vals-missing-func',
  23: 'duplicate-pro',
  24: 'duplicate-func',
  25: 'duplicate-pro-method',
  26: 'duplicate-func-method',
  27: 'duplicate-struct',
  28: 'duplicate-sys-var',
  29: 'reserved-pro',
  30: 'reserved-func',
  31: 'return-missing',
  32: 'routines-first',
  33: 'unclosed-main',
  34: 'empty-main',
  35: 'after-continuation',
  36: 'reserved-pro-method',
  37: 'reserved-func-method',
  38: 'no-comp-opt',
  39: 'no-idl2',
  40: 'illegal-comp-opt',
  41: 'empty-comp-opt',
  42: 'use-idl2',
  43: 'expected-comma',
  44: 'unexpected-comma',
  45: 'multiple-comp-opt',
  46: 'unclosed-quote',
  47: 'args-first',
  48: 'docs-missing-args',
  49: 'no-args-to-doc',
  50: 'docs-missing-kws',
  51: 'no-kws-to-doc',
  52: 'docs-missing-return',
  53: 'docs-invalid-in-out',
  54: 'docs-invalid-required',
  55: 'docs-invalid-type',
  56: 'docs-invalid-private',
  57: 'docs-too-few-params',
  58: 'docs-too-many-params',
  59: 'docs-left-align',
  60: 'docs-return-has-no-type',
  61: 'docs-return-invalid',
  62: 'docs-return-not-needed',
  63: 'docs-not-real-param',
  64: 'docs-param-missing',
  65: 'string-literal-too-many-args',
  66: 'bad-continue',
  67: 'bad-break',
  68: 'expected-statement',
  69: 'unfinished-dot',
  70: 'illegal-hex-escape',
  71: 'unknown-template-escape',
  72: 'duplicate-arg-kw-var-def',
  73: 'duplicate-kw-def',
  74: 'duplicate-property',
  75: 'duplicate-kw-usage',
  76: 'init-method-pro',
  77: 'unknown-structure',
  78: 'illegal-chain',
  79: 'docs-missing-struct',
  80: 'docs-missing-prop',
  81: 'class-no-params',
  82: 'docs-prop-too-few-params',
  83: 'docs-prop-too-many-params',
  84: 'illegal-subscript',
  85: 'illegal-struct-op',
  86: 'illegal-list-op',
  87: 'illegal-hash-op',
  88: 'illegal-ordered-hash-op',
  89: 'illegal-dictionary-op',
  90: 'potential-type-incompatibility',
  91: 'illegal-index-type',
  92: 'potential-arr-type-incompatibility',
  93: 'ptr-nothing-to-de-ref',
  94: 'ptr-de-ref-illegal',
  95: 'indexing-error',
  96: 'ptr-de-ref-ambiguity',
  97: 'unknown-kw',
  98: 'incomplete-ternary',
  99: 'undefined-var',
  100: 'potential-undefined-var',
  101: 'var-use-before-def',
  102: 'potential-var-use-before-def',
  103: 'ambiguous-keyword-abbreviation',
  104: 'unused-var',
  105: 'illegal-var-index',
  106: 'circular-include',
  107: 'unknown-disabled-alias',
  108: 'standalone-expression',
  109: 'implied-print-nb',
};

/** Reverse lookup for problems codes with alias giving the problem code back */
export const IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP: ReverseProblemCodeAliasLookup =
  {};
const keys = Object.keys(IDL_PROBLEM_CODE_ALIAS_LOOKUP);
for (let i = 0; i < keys.length; i++) {
  IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP[
    IDL_PROBLEM_CODE_ALIAS_LOOKUP[keys[i]]
  ] = +keys[i] as IDLProblemCode;
}

/**
 * Constant that defines the keys to access our shorthand problem code groups
 */
export const IDL_PROBLEM_CODE_SHORTHAND_LOOKUP = {
  /**
   * All problem codes relate to documentation. Tracked so that we have have
   * shorthand/preferences to disable all of these at once instead of requiring a user
   * to manually turn off each problem code.
   */
  IDL_DOCS: 'idl-docs',
  /**
   * Problem codes related to the compile opt idl2 statement
   */
  COMPILE_OPT: 'compile_opt',
};

/**
 * Tracks/groups IDL problem codes by aliases for simpler enabling/disabling
 * of problem codes.
 */
export const IDL_PROBLEM_CODE_SHORTHAND_CODE_LOOKUP: {
  [key: string]: IDLProblemCode[];
} = {};

/**
 * Define problem codes we ignore related to docs
 */
IDL_PROBLEM_CODE_SHORTHAND_CODE_LOOKUP[
  IDL_PROBLEM_CODE_SHORTHAND_LOOKUP.IDL_DOCS
] = [
  IDL_PROBLEM_CODES.ARGS_MISSING_FROM_DOCS,
  IDL_PROBLEM_CODES.NO_ARGS_TO_DOCUMENT,
  IDL_PROBLEM_CODES.KEYWORDS_MISSING_FROM_DOCS,
  IDL_PROBLEM_CODES.NO_KEYWORDS_TO_DOCUMENT,
  IDL_PROBLEM_CODES.RETURNS_MISSING_FROM_DOCS,
  IDL_PROBLEM_CODES.INVALID_IN_OUT_DOCS,
  IDL_PROBLEM_CODES.INVALID_REQUIRED_OPTIONAL_DOCS,
  IDL_PROBLEM_CODES.INVALID_TYPE_DOCS,
  IDL_PROBLEM_CODES.INVALID_PRIVATE_DOCS,
  IDL_PROBLEM_CODES.NOT_ENOUGH_DOCS_PARAMETERS,
  IDL_PROBLEM_CODES.TOO_MANY_DOCS_PARAMETERS,
  IDL_PROBLEM_CODES.DOCS_NOT_LEFT_ALIGNED,
  IDL_PROBLEM_CODES.RETURN_DOCS_MISSING_TYPE,
  IDL_PROBLEM_CODES.RETURN_DOCS_INVALID,
  IDL_PROBLEM_CODES.RETURN_DOCS_NOT_NEEDED,
  IDL_PROBLEM_CODES.DOCUMENTED_PARAMETER_DOESNT_EXIST,
  IDL_PROBLEM_CODES.PARAMETER_IS_MISSING_FROM_DOCS,
  IDL_PROBLEM_CODES.MISSING_STRUCTURE_FROM_DOCS,
  IDL_PROBLEM_CODES.PROPERTY_MISSING_FROM_DOCS,
  IDL_PROBLEM_CODES.NOT_ENOUGH_PROPERTY_DOCS_PARAMETERS,
  IDL_PROBLEM_CODES.TOO_MANY_PROPERTY_DOCS_PARAMETERS,
];

/**
 * For disabling compile-opt idl2 related errors
 */
IDL_PROBLEM_CODE_SHORTHAND_CODE_LOOKUP[
  IDL_PROBLEM_CODE_SHORTHAND_LOOKUP.COMPILE_OPT
] = [
  IDL_PROBLEM_CODES.NO_COMPILE_OPT,
  IDL_PROBLEM_CODES.NO_COMPILE_OPT_IDL2,
  IDL_PROBLEM_CODES.USE_IDL2_COMPILE_OPT,
];
