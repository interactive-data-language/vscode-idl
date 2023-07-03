import {
  ITokenDef,
  LineContinuationBasicToken,
  LineContinuationToken,
  LineSeparationBasicToken,
  LineSeparationToken,
  TOKEN_NAMES,
} from '../../tokens.interface';

export type LineContinuationTokenDef = ITokenDef<LineContinuationToken>;

/**
 * Regex for line continuations
 */
export const LINE_CONTINUATION: LineContinuationTokenDef = {
  name: TOKEN_NAMES.LINE_CONTINUATION,
  match: /\$/im,
  end: /$/im,
  nextLineOnClose: true,
};

export type LineContinuationBasicTokenDef =
  ITokenDef<LineContinuationBasicToken>;

/**
 * Regex for line continuations within line continuation
 */
export const LINE_CONTINUATION_BASIC: LineContinuationBasicTokenDef = {
  name: TOKEN_NAMES.LINE_CONTINUATION_BASIC,
  match: /\$/im,
};

export type LineSeparationTokenDef = ITokenDef<LineSeparationToken>;

/**
 * Regex for line separators
 */
export const LINE_SEPARATOR: LineSeparationTokenDef = {
  name: TOKEN_NAMES.LINE_SEPARATION,
  match: /(?<!&)&(?!&)/im,
  end: /(?=\b(endif|endelse|endfor|endforeach|endrep|endwhile|endswitch|endcase|end)\b|(?<!&)&(?!&))|$/im,
};

export type BasicLineSeparationTokenDef = ITokenDef<LineSeparationBasicToken>;

/**
 * Regex for line separators within switch and case because
 * people write really gross code with switch statements like
 * `1: & 2: begin...`
 */
export const BASIC_LINE_SEPARATOR: BasicLineSeparationTokenDef = {
  name: TOKEN_NAMES.LINE_SEPARATION_BASIC,
  match: LINE_SEPARATOR.match,
};
