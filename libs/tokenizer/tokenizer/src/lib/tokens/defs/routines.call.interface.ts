import {
  CallFunctionMethodToken,
  CallFunctionToken,
  CallLambdaFunctionToken,
  CallProcedureMethodToken,
  CallProcedureToken,
  ITokenDef,
  TOKEN_NAMES,
} from '../../tokens.interface';
import { IDL_PRO_END } from '../regex.interface';

export type FunctionCallTokenDef = ITokenDef<
  CallFunctionToken | CallLambdaFunctionToken
>;

export const CALL_FUNCTION: FunctionCallTokenDef = {
  name: TOKEN_NAMES.CALL_FUNCTION,
  match: /([a-z_][a-z0-9_$]*)\s*\(/im,
  end: /\)/im,
  getTokenName: (matches) => {
    const compare = matches[1].toLowerCase();

    // handle special case for lambda function
    if (compare === 'lambda') {
      return TOKEN_NAMES.CALL_LAMBDA_FUNCTION;
    } else {
      return TOKEN_NAMES.CALL_FUNCTION;
    }
  },
};

/**
 * Matches for when we call functions
 *
 * @param {string} full Full match for the function, including paren
 * @param {string} name Name of the function without paren
 */
export type CallFunctionMatches = [full: string, name: string];

export type ProcedureCallTokenDef = ITokenDef<CallProcedureToken>;

export const CALL_PRO: ProcedureCallTokenDef = {
  name: TOKEN_NAMES.CALL_PROCEDURE,
  match: /[a-z_][a-z0-9_$]*(?!\.)(?=\s*,|\s*;|\s+\$|\s*$|\s*(?<!&)&(?!&))/im,
  end: IDL_PRO_END,
};

/**
 * Matches for when we call procedures
 *
 * @param {string} full Full match for the procedure, excludes any trailing commas
 */
export type CallProcedureMatches = [full: string];

export type FunctionMethodCallTokenDef = ITokenDef<CallFunctionMethodToken>;

export const CALL_FUNCTION_METHOD: FunctionMethodCallTokenDef = {
  name: TOKEN_NAMES.CALL_FUNCTION_METHOD,
  match: /(\.|->)\s*([a-z0-9_$:]+)\s*(\()/im,
  end: /\)/im,
};

/**
 * Matches for when we call function methods
 *
 * @param {string} full Full match for the function method, including paren at end adn operator
 * @param {string} operator Operator (dot or arrow)
 * @param {string} name Same of the method (either method name or super::method)
 * @param {string} paren Opening parentheses
 */
export type CallFunctionMethodMatches = [
  full: string,
  operator: string,
  name: string,
  paren: string
];

export type ProcedureMethodCallTokenDef = ITokenDef<CallProcedureMethodToken>;

export const CALL_PRO_METHOD: ProcedureMethodCallTokenDef = {
  name: TOKEN_NAMES.CALL_PROCEDURE_METHOD,
  match:
    /(\.|->)\s*([a-z_][a-z0-9_$:]*)(?=\s*(?<!&)&(?!&)|\s*,|\s*;|\s+\$|\s*$)/im,
  end: IDL_PRO_END,
};

/**
 * Matches for when we call procedure methods
 *
 * @param {string} full Full match for the procedure method, excludes training comma if it exists
 * @param {string} operator Operator (dot or arrow)
 * @param {string} name Same of the method (either method name or super::method)
 */
export type CallProcedureMethodMatches = [
  full: string,
  operator: string,
  name: string
];
