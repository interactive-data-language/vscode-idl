import { IncludeToken } from '@idl/tokenizer';
import { IBaseIndexedToken } from '@idl/types/idl-data-types';
import { TreeToken } from '@idl/types/syntax-tree';

import { IDLIndex } from '../../idl-index.class';

/**
 * Finds the source file for an include
 */
export function GetIncludeDef(
  index: IDLIndex,
  token: TreeToken<IncludeToken>
): IBaseIndexedToken {
  let found: IBaseIndexedToken;

  // resolve the file
  const foundFile = index.resolveInclude(token);

  // check if we found one
  if (foundFile !== '') {
    found = {
      name: token.match[0].toLowerCase(),
      file: foundFile,
      pos: [0, 0, 0],
    };
  }

  return found;
}
