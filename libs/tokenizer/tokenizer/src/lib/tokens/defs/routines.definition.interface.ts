import {
  ITokenDef,
  RoutineFunctionToken,
  RoutineMethodNameToken,
  RoutineNameToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '../../tokens.interface';
import { IDL_LINE_END } from '../regex.interface';

export type RoutineTokenDef = ITokenDef<
  RoutineFunctionToken | RoutineProcedureToken
>;

/**
 * For matching routine definitions
 */
export const ROUTINE_DEF: RoutineTokenDef = {
  name: TOKEN_NAMES.ROUTINE_PROCEDURE,
  match: /\b(pro|function)\s+/im,
  end: /\bend\b/im,
  getTokenName: (matches) => {
    if (matches.length !== 2) {
      console.log('Routine def regex did not extract two matches as expected');
      return TOKEN_NAMES.ROUTINE_PROCEDURE;
    }

    // check if pro or function
    if (matches[1].toLowerCase() === 'function') {
      return TOKEN_NAMES.ROUTINE_FUNCTION;
    } else {
      return TOKEN_NAMES.ROUTINE_PROCEDURE;
    }
  },
};

export type RoutineDetailsTokenDef = ITokenDef<
  RoutineMethodNameToken | RoutineNameToken
>;

/**
 * For matching routine definitions
 */
export const ROUTINE_NAME: RoutineDetailsTokenDef = {
  name: TOKEN_NAMES.ROUTINE_NAME,
  match: /([a-z_$!0-9]+)::([a-z_$0-9]+)|[a-z_$!0-9]+/im,
  end: IDL_LINE_END,
  getTokenName: (matches) => {
    if (matches.length === 3) {
      return TOKEN_NAMES.ROUTINE_METHOD_NAME;
    } else {
      return TOKEN_NAMES.ROUTINE_NAME;
    }
  },
  defaultTokens: true,
};

/**
 * Matches for routine names
 *
 * @param {string} name Full match for routine name
 */
export type RoutineNameMatches = [name: string];

/**
 * Matches for routine method names
 *
 * @param {string} fullMatch Full match for method name
 * @param {string} className Class name
 * @param {string} methodName Method name
 */
export type RoutineMethodNameMatches = [
  fullMatch: string,
  className: string,
  methodName: string
];
