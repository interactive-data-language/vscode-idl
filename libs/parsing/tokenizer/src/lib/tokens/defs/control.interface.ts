import {
  ControlBreakToken,
  ControlCommonToken,
  ControlCompileOptToken,
  ControlContinueToken,
  ControlForwardFunctionOptToken,
  ControlGoToToken,
  ControlJumpToken,
  ITokenDef,
  TOKEN_NAMES,
} from '../../tokens.interface';
import { IDL_LOGICAL_STATEMENT_END } from '../regex.interface';

const TOKEN_MAP = {
  break: TOKEN_NAMES.CONTROL_BREAK,
  continue: TOKEN_NAMES.CONTROL_CONTINUE,
  common: TOKEN_NAMES.CONTROL_COMMON,
  compile_opt: TOKEN_NAMES.CONTROL_COMPILE_OPT,
  forward_function: TOKEN_NAMES.CONTROL_FORWARD_FUNCTION,
  goto: TOKEN_NAMES.CONTROL_GO_TO,
};

export type ControlSimpleTokenDef = ITokenDef<
  ControlBreakToken | ControlContinueToken | ControlJumpToken
>;

/**
 * Regex for basic control statements (break|continue|jump)
 */
export const CONTROL_BASIC: ControlSimpleTokenDef = {
  name: TOKEN_NAMES.CONTROL_BREAK,
  match: /\bbreak\b|\bcontinue\b|\b[a-z][a-z0-9_$]*(\s*:)/im,
  getTokenName: (matches) => {
    if (matches.length > 2 || matches.length < 1) {
      console.log(
        'Basic control token regex detected more than one or two matches, not expected'
      );
      return TOKEN_NAMES.CONTROL;
    }

    if (matches.length === 1) {
      const compare = matches[0].toLowerCase();
      if (compare in TOKEN_MAP) {
        return TOKEN_MAP[compare];
      } else {
        console.log(
          'Basic control token did not detect "break" or "continue" for single match, not expected'
        );
        return TOKEN_NAMES.CONTROL;
      }
    } else {
      return TOKEN_NAMES.CONTROL_JUMP;
    }
  },
};

/**
 * Union type for control statements that contain arguments
 */
export type ControlCompoundTokenDef = ITokenDef<
  | ControlCommonToken
  | ControlCompileOptToken
  | ControlForwardFunctionOptToken
  | ControlGoToToken
>;

/**
 * Regex for compound control statements (common|compile_opt|forward_function|goto)
 */
export const CONTROL_COMPOUND: ControlCompoundTokenDef = {
  name: TOKEN_NAMES.CONTROL_COMMON,
  match: /\bcommon\b|\bcompile_opt\b|\bforward_function\b|\bgoto\b/im,
  end: IDL_LOGICAL_STATEMENT_END,
  getTokenName: (matches) => {
    if (matches.length !== 1) {
      console.log(
        'Compound control token did not detect one match as expected'
      );
      return TOKEN_NAMES.CONTROL;
    }

    const compare = matches[0].toLowerCase();

    if (compare in TOKEN_MAP) {
      return TOKEN_MAP[compare];
    } else {
      console.log(
        'Basic control token did not detect "common|compile_opt|forward_function|goto" as expected'
      );
      return TOKEN_NAMES.CONTROL;
    }
  },
};
