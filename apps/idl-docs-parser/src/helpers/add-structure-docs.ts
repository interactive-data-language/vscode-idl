import { DocsToMarkdown, MARKDOWN_TYPE_LOOKUP } from '@idl/parsing/syntax-tree';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalStructureToken,
  GlobalTokens,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';

/**
 * Works through all structures and adds in properties for docs
 */
export function AddStructureDocs(global: GlobalTokens) {
  // clear docs lookup
  for (let i = 0; i < global.length; i++) {
    // filter structures
    if (global[i].type === GLOBAL_TOKEN_TYPES.STRUCTURE) {
      const token = global[i] as IGlobalIndexedToken<GlobalStructureToken>;

      // create documentation
      token.meta.docs = DocsToMarkdown(MARKDOWN_TYPE_LOOKUP.STRUCTURE, {
        name: token.name,
        meta: token.meta,
      });
    }
  }
}
