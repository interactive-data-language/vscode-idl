import {
  ExecutiveCommandToken,
  ITokenDef,
  TOKEN_NAMES,
} from '../../tokens.interface';

export type ExecutiveCommandTokenDef = ITokenDef<ExecutiveCommandToken>;

/**
 * Regex to find variable assignment
 */
export const EXECUTIVE_COMMAND: ExecutiveCommandTokenDef = {
  name: TOKEN_NAMES.EXECUTIVE_COMMAND,
  match: /^\s*\.([a-z_]+)\s*(.*)$/im,
  onlyFirst: true,
};

/**
 * Matches detected from executive commands
 * @param {string} match Full match
 * @param {string} args Command args
 * @param {string} after Everything afterwards
 */
export type ExecutiveCommandMatches = [
  match: string,
  args: string,
  after: string
];
