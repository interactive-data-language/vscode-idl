import {
  ITokenDef,
  TOKEN_NAMES,
  TypeOrOperatorToken,
} from '../../tokens.interface';

export type TypeOrOperatorTokenDef = ITokenDef<TypeOrOperatorToken>;

export const TYPE_OR_OPERATOR: TypeOrOperatorTokenDef = {
  name: TOKEN_NAMES.TYPE_OR_OPERATOR,
  match: /\|/im,
};
