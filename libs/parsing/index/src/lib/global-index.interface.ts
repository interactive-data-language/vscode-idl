import { GlobalTokenType, IGlobalIndexedToken } from '@idl/types/core';
import { IDL_PROBLEM_CODES, IDLProblemCode } from '@idl/types/problem-codes';

/**
 * By token type, wwe want to track the number of tokens we have with the
 * same name. This way we can detect problems as we build the tree if there
 * is already a token with the same name.
 */
export interface TokensCountsByName {
  [key: string]: { [name: string]: number };
}

/**
 * Shorthand type for globally indexed tokens
 */
export type GlobalIndexedToken = IGlobalIndexedToken<GlobalTokenType>;

/**
 * Lookup with all tokens by type. We store an array of the token types
 * which we can manually search through to find.
 */
export interface GlobalTokensByTypeByName {
  [key: string]: { [key: string]: GlobalIndexedToken[] };
}

/**
 * Lookup with tokens by type for easier access when we export
 */
export type ExportedGlobalTokensByType = {
  [key in GlobalTokenType]: IGlobalIndexedToken<key>[];
};

/**
 * For each file we index tokens for, track which types of tokens they
 * contribute to filter the locations we need to clean up tokens from so
 * we don't need to process all tokens.
 */
export interface ITokenTypesByFile {
  [file: string]: { [key: string]: GlobalIndexedToken[] };
}

/**
 * Maps our token types to problem codes
 */
export type ProblemMap = {
  [key in GlobalTokenType]: IDLProblemCode;
};

/**
 * Maps global tokens to problem codes
 */
export const PROBLEM_MAP: ProblemMap = {
  p: IDL_PROBLEM_CODES.DUPLICATE_PROCEDURE,
  f: IDL_PROBLEM_CODES.DUPLICATE_FUNCTION,
  pm: IDL_PROBLEM_CODES.DUPLICATE_PROCEDURE_METHOD,
  fm: IDL_PROBLEM_CODES.DUPLICATE_FUNCTION_METHOD,
  s: IDL_PROBLEM_CODES.DUPLICATE_STRUCTURE,
  sv: IDL_PROBLEM_CODES.DUPLICATE_SYSTEM_VARIABLE,
  /** Not actually used, just needed for our type definitions */
  c: IDL_PROBLEM_CODES.UNKNOWN_TOKEN,
};
