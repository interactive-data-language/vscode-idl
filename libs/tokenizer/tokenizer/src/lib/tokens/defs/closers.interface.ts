import {
  ITokenDef,
  MainLevelEndToken,
  TOKEN_NAMES,
  UnexpectedCloserToken,
} from '../../tokens.interface';

export type CloserTokenDef = ITokenDef<UnexpectedCloserToken>;

/**
 * For detecting unexpected closing statements
 */
export const UNEXPECTED_CLOSER: CloserTokenDef = {
  name: TOKEN_NAMES.UNEXPECTED_CLOSER,
  match:
    /\)|\]|\}|\b(endif|endelse|endfor|endforeach|endrep|endwhile|endswitch|endcase|end)\b/im,
};

export type MainLevelEndTokenDef = ITokenDef<MainLevelEndToken>;

/**
 * For detecting end of main level programs
 */
export const MAIN_LEVEL_END: MainLevelEndTokenDef = {
  name: TOKEN_NAMES.MAIN_LEVEL_END,
  match: /\bend\b/im,
};
