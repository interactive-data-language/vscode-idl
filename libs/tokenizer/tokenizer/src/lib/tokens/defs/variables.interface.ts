import {
  ITokenDef,
  SystemVariableToken,
  TOKEN_NAMES,
  VariableToken,
} from '../../tokens.interface';

export type VariableTokenDef = ITokenDef<VariableToken | SystemVariableToken>;

/**
 * Regex to find variable assignment
 */
export const VARIABLE: VariableTokenDef = {
  name: TOKEN_NAMES.VARIABLE,
  // start: /(?<!\.|\/|:|->)\b([a-z0-9_$]+)\s*(?=[.[\])*\-+,])/im,
  match: /![a-z0-9_$]*|(?<!\.|\/|::|->|@)\b[a-z0-9_$]+(?![a-z0-9_$]*::)/im,
  getTokenName: (matches) => {
    if (matches[0].startsWith('!')) {
      return TOKEN_NAMES.SYSTEM_VARIABLE;
    } else {
      return TOKEN_NAMES.VARIABLE;
    }
  },
};

/**
 * Matches for variables
 *
 * @param {string} name Full match for variable name
 */
export type VariableMatches = [name: string];
