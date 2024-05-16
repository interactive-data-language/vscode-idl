import {
  ITokenDef,
  OperatorIncrementDecrementToken,
  TOKEN_NAMES,
} from '../../tokens.interface';

export type OperatorsBasicTokenDef = ITokenDef<OperatorIncrementDecrementToken>;

/**
 * Regex for basic operators that do not have children
 *
 * NOT USED - We reverted this change, it is not in the operators
 */
export const OPERATORS_BASIC: OperatorsBasicTokenDef = {
  name: TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT,
  match: /\+\+|--/im,
};
