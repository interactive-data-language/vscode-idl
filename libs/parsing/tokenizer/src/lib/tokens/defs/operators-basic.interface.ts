import {
  ITokenDef,
  OperatorIncrementDecrementToken,
  TOKEN_NAMES,
} from '../../tokens.interface';

export type OperatorsBasicTokenDef = ITokenDef<OperatorIncrementDecrementToken>;

/**
 * Regex for basic operators that do not have children
 */
export const OPERATORS_BASIC: OperatorsBasicTokenDef = {
  name: TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT,
  match: /\+\+|--/im,
};
