import { ITokenDef, PromptToken, TOKEN_NAMES } from '../../tokens.interface';

export type PromptTokenDef = ITokenDef<PromptToken>;

/**
 * Regex for blocks using a begin statement
 */
export const PROMPT: PromptTokenDef = {
  name: TOKEN_NAMES.PROMPT,
  match: /(?:envi|idl)>/im,
};
