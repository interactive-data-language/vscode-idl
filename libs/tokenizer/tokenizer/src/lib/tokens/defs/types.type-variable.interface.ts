import {
  ITokenDef,
  TOKEN_NAMES,
  TypeVariableToken,
} from '../../tokens.interface';

export type TypeVariableTokenDef = ITokenDef<TypeVariableToken>;

export const TYPE_VARIABLE: TypeVariableTokenDef = {
  name: TOKEN_NAMES.TYPE_VARIABLE,
  match: /!?[a-z_][a-z0-9_$]*/im,
};
