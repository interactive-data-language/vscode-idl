import {
  ITokenDef,
  OperatorIncrementDecrementToken,
  OperatorToken,
  TOKEN_NAMES,
} from '../../tokens.interface';
import { IDL_OPERATOR_END } from '../regex.interface';

export type OperatorTokenDef = ITokenDef<
  OperatorToken | OperatorIncrementDecrementToken
>;

const TOKEN_LOOKUP = {
  '++': TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT,
  '--': TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT,
  '&&': TOKEN_NAMES.OPERATOR_LOGICAL,
  '||': TOKEN_NAMES.OPERATOR_LOGICAL,
  not: TOKEN_NAMES.OPERATOR_LOGICAL,
  eq: TOKEN_NAMES.OPERATOR_LOGICAL,
  ne: TOKEN_NAMES.OPERATOR_LOGICAL,
  le: TOKEN_NAMES.OPERATOR_LOGICAL,
  lt: TOKEN_NAMES.OPERATOR_LOGICAL,
  ge: TOKEN_NAMES.OPERATOR_LOGICAL,
  gt: TOKEN_NAMES.OPERATOR_LOGICAL,
  and: TOKEN_NAMES.OPERATOR_LOGICAL,
  or: TOKEN_NAMES.OPERATOR_LOGICAL,
  xor: TOKEN_NAMES.OPERATOR_LOGICAL,
};

/**
 * Regex for operators
 */
export const OPERATOR: OperatorTokenDef = {
  name: TOKEN_NAMES.OPERATOR,
  match:
    /(?:\*|\+\+|--|\^|##|#|\*|\/|\bmod\b|\+|-(?!>)|<|(?<!-|>)>(?!>)|~|\bnot\b|\beq\b|\bne\b|\ble\b|\blt\b|\bge\b|\bgt\b|\band\b|\bor\b|\bxor\b|&&|\|\|)(?!=)/im,
  end: IDL_OPERATOR_END,
  getTokenName: (matches) => {
    const match = matches[0].toLowerCase();

    // check for special sub-category
    if (match in TOKEN_LOOKUP) {
      return TOKEN_LOOKUP[match];
    } else {
      return TOKEN_NAMES.OPERATOR;
    }
  },
};

/**
 * Matches for operators
 *
 * @param {string} operator Full match for the operator
 */
export type OperatorMatches = [operator: string];
