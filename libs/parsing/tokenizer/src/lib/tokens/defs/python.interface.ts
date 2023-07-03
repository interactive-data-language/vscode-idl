import { ITokenDef, PythonToken, TOKEN_NAMES } from '../../tokens.interface';

export type PythonTokenDef = ITokenDef<PythonToken>;

/**
 * Embedded python code
 */
export const PYTHON: PythonTokenDef = {
  name: TOKEN_NAMES.PYTHON,
  match: />>>.*$/im,
};
