import {
  ISplitTreeOnArguments,
  SplitTreeOnArguments,
  TreeBranchToken,
} from '@idl/parsing/syntax-tree';

import { ITokenCache } from '../../../helpers/token-cache.interface';

/**
 * Helper method to interact with our cache and get split tree for us
 */
export function GetSplit(token: TreeBranchToken): ISplitTreeOnArguments {
  // populate cache if we need to
  if ((token.cache as ITokenCache).argSplit === undefined) {
    (token.cache as ITokenCache).argSplit = SplitTreeOnArguments(token);
  }
  return (token.cache as ITokenCache).argSplit;
}
