import { ITokenDef, TokenName } from '../tokens.interface';
import { ALL_TOKENS } from './full/def-groups-full.interface';
import { ISubTokenDefs } from './full/sub-defs-full.interface';

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
