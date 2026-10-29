import type { StructureNameToken } from '@idl/tokenizer';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/idl-data-types';
import type { TreeToken } from '@idl/types/syntax-tree';

import type { GlobalIndexedToken } from '../../global-index.interface';
import type { IDLIndex } from '../../idl-index.class';

/**
 * Returns the matching global token for a named structure
 */
export function GetStructureDef(
  index: IDLIndex,
  token: TreeToken<StructureNameToken>,
): GlobalIndexedToken | undefined {
  // find match
  const global = index.findMatchingGlobalToken(
    GLOBAL_TOKEN_TYPES.STRUCTURE,
    token.match[0],
  );

  // return
  if (global.length > 0) {
    return global[0];
  }
}
