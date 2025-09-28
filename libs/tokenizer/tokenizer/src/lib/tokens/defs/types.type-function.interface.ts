import {
  ITokenDef,
  TOKEN_NAMES,
  TypeFunctionToken,
} from '../../tokens.interface';

export type TypeFunctionTokenDef = ITokenDef<TypeFunctionToken>;

export const TYPE_FUNCTION: TypeFunctionTokenDef = {
  name: TOKEN_NAMES.TYPE_FUNCTION,
  match: /([a-z_][a-z0-9_$]*)\s*</im,
  end: />/im,
};

/**
 * Matches for when we call a type function
 *
 * @param {string} full Full match for the type function, including alligators
 * @param {string} name Name of the function without paren
 */
export type TypeFunctionMatches = [full: string, name: string];
