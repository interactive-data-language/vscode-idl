import {
  ITokenDef,
  LoopDoToken,
  LoopForeachToken,
  LoopForToken,
  LoopRepeatToken,
  LoopUntilToken,
  LoopWhileToken,
  TOKEN_NAMES,
} from '../../tokens.interface';
import { IDL_STATEMENT_END } from '../regex.interface';

/** Union for all allowed loop tokens */
export type LoopStartTokens =
  | LoopForToken
  | LoopForeachToken
  | LoopWhileToken
  | LoopRepeatToken;

export type LoopStartTokenDef = ITokenDef<LoopStartTokens>;

/**
 * Map the extracted text from regex to
 */
const TOKEN_TYPE_BY_MATCH = {
  do: TOKEN_NAMES.LOOP_DO,
  for: TOKEN_NAMES.LOOP_FOR,
  foreach: TOKEN_NAMES.LOOP_FOREACH,
  repeat: TOKEN_NAMES.LOOP_REPEAT,
  while: TOKEN_NAMES.LOOP_WHILE,
  until: TOKEN_NAMES.LOOP_UNTIL,
};

/**
 * Regex to find for, foreach, while, and repeat loops
 */
export const LOOP_START: LoopStartTokenDef = {
  name: TOKEN_NAMES.LOOP_FOR,
  match: /\b(?:for|foreach|while|repeat)\b/im,
  end: IDL_STATEMENT_END,
  getTokenName: (matches) => {
    // extract compare statement
    const compare = matches[0].toLowerCase();

    // validate it is there
    if (!(compare in TOKEN_TYPE_BY_MATCH)) {
      return TOKEN_NAMES.LOOP_FOR;
    }

    return TOKEN_TYPE_BY_MATCH[compare];
  },
};

/** Union for all allowed loop tokens */
export type LoopSecondaryTokens = LoopDoToken | LoopUntilToken;

export type LoopSecondaryTokenDef = ITokenDef<LoopSecondaryTokens>;

/**
 * Regex to find the "do" or "until" portions of loops
 */
export const LOOP_SECONDARY: LoopSecondaryTokenDef = {
  name: TOKEN_NAMES.LOOP_DO,
  match: /\b(?:do|until)\b/im,
  end: IDL_STATEMENT_END,
  getTokenName: (matches) => {
    // extract compare statement
    const compare = matches[0].toLowerCase();

    // validate it is there
    if (!(compare in TOKEN_TYPE_BY_MATCH)) {
      return TOKEN_NAMES.LOOP_DO;
    }

    return TOKEN_TYPE_BY_MATCH[compare];
  },
};
