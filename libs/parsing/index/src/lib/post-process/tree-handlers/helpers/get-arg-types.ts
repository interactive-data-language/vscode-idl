import { IParsed, TreeBranchToken } from '@idl/parsing/syntax-tree';
import { IDLDataType } from '@idl/types/core';

import { ITokenCache } from '../../../helpers/token-cache.interface';
import { IDLIndex } from '../../../idl-index.class';
import { TypeFromTokens } from '../../populate-type/from/type-from-tokens';
import { GetSplit } from './get-split';

/**
 * Given a token, gets the type for each argument
 */
export function GetArgTypes(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeBranchToken
): IDLDataType[] {
  if ('argTypes' in (token.cache as ITokenCache)) {
    return (token.cache as ITokenCache).argTypes;
  }

  // split the tokens by our arguments
  const split = GetSplit(token);

  // track the types by arguments
  const argTypes: IDLDataType[] = [];

  // save our type args
  (token.cache as ITokenCache).argTypes = argTypes;

  // process each arg
  for (let i = 0; i < split.args.length; i++) {
    argTypes.push(TypeFromTokens(index, parsed, split.args[i]));
  }

  // return our types
  return argTypes;
}
