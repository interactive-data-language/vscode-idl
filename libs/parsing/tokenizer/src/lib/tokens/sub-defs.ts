import { ITokenDef, TokenName } from '../tokens.interface';
import { ALL_TOKENS } from './def-groups.interface';
import { ISubTokenDefs } from './sub-defs.interface';

/**
 * Given a token, returns the tokens that we should use to recurse
 */
export function GetSubDefs(
  token: TokenName,
  subDefs: ISubTokenDefs
): ITokenDef<TokenName>[] {
  // check if we have a value, otherwise return our default
  if (token in subDefs) {
    return subDefs[token];
  } else {
    return ALL_TOKENS;
  }
}
