import { IParsed } from './build-tree.interface';
import { TreeRecurserBasic } from './recursion-and-callbacks/tree-recurser-basic';

/**
 * Set the cache to make sure it is present
 */
export function SetTokenCache(parsed: IParsed): void {
  if (!parsed.hasCache) {
    TreeRecurserBasic(parsed.tree, {
      onBasicToken: (token) => {
        token.cache = {};
      },
      onBranchToken: (token) => {
        token.cache = {};
      },
    });
    parsed.hasCache = true;
  }
}
