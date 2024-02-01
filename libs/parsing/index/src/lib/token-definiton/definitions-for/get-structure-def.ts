import { TreeToken } from '@idl/parsing/syntax-tree';
import { StructureNameToken } from '@idl/parsing/tokenizer';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';

import { GlobalIndexedToken } from '../../global-index.interface';
import { IDLIndex } from '../../idl-index.class';

/**
 * Returns the matching global token for a named structure
 */
export function GetStructureDef(
  index: IDLIndex,
  token: TreeToken<StructureNameToken>
): GlobalIndexedToken | undefined {
  // find match
  const global = index.findMatchingGlobalToken(
    GLOBAL_TOKEN_TYPES.STRUCTURE,
    token.match[0]
  );

  // return
  if (global.length > 0) {
    return global[0];
  }
}
